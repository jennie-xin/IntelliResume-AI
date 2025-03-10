import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.js'
import type { CreateResumeInput, UpdateResumeInput, SaveResumeContentInput, PaginationInput } from '../utils/validation.js'

const prisma = new PrismaClient()

/** 校验简历所有权，不存在返回 404，无权返回 403 */
async function ensureResumeOwnership(resumeId: string, userId: string, errorType: 'edit' | 'delete' = 'edit') {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    select: { id: true },
  })
  if (!resume) {
    // 先检查简历是否存在
    const exists = await prisma.resume.findUnique({ where: { id: resumeId }, select: { id: true } })
    if (!exists) throw new AppError(404, '简历不存在')
    throw new AppError(403, `无权${errorType === 'delete' ? '删除' : '编辑'}该简历`)
  }
  return resume
}

/** 创建新简历 */
export async function createResume(userId: string, data: CreateResumeInput) {
  // 验证模板是否存在
  const template = await prisma.template.findUnique({ where: { id: data.templateId } })
  if (!template) {
    throw new AppError(400, '模板 ID 无效')
  }

  const resume = await prisma.resume.create({
    data: {
      userId,
      title: data.title,
      templateId: data.templateId,
      content: {
        create: {},
      },
    },
    include: { content: true, template: { select: { name: true, schemaKey: true } } },
  })

  return formatResume(resume)
}

/** 获取简历列表 */
export async function getResumeList(userId: string, params: PaginationInput) {
  const where = { userId }
  const [items, total] = await Promise.all([
    prisma.resume.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      select: {
        id: true,
        title: true,
        templateId: true,
        createdAt: true,
        updatedAt: true,
        template: { select: { name: true, schemaKey: true } },
      },
    }),
    prisma.resume.count({ where }),
  ])

  return {
    items: items.map((r) => ({
      ...r,
      templateName: r.template.name,
    })),
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

/** 获取简历详情（含内容） */
export async function getResumeDetail(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: {
      content: true,
      template: { select: { name: true, schemaKey: true } },
    },
  })

  if (!resume) {
    throw new AppError(404, '简历不存在')
  }

  return formatResume(resume)
}

/** 保存简历内容 */
export async function saveResumeContent(resumeId: string, userId: string, data: SaveResumeContentInput) {
  await ensureResumeOwnership(resumeId, userId)

  const updated = await prisma.resumeContent.upsert({
    where: { resumeId },
    create: {
      resumeId,
      basicInfo: JSON.stringify(data.basicInfo ?? {}),
      education: JSON.stringify(data.education ?? []),
      workExperience: JSON.stringify(data.workExperience ?? []),
      projectExperience: JSON.stringify(data.projectExperience ?? []),
      skills: JSON.stringify(data.skills ?? []),
    },
    update: {
      ...(data.basicInfo !== undefined && { basicInfo: JSON.stringify(data.basicInfo) }),
      ...(data.education !== undefined && { education: JSON.stringify(data.education) }),
      ...(data.workExperience !== undefined && { workExperience: JSON.stringify(data.workExperience) }),
      ...(data.projectExperience !== undefined && { projectExperience: JSON.stringify(data.projectExperience) }),
      ...(data.skills !== undefined && { skills: JSON.stringify(data.skills) }),
    },
  })

  return { updatedAt: updated.updatedAt }
}

/** 更新简历元信息（标题、模板） */
export async function updateResumeMeta(resumeId: string, userId: string, data: UpdateResumeInput) {
  await ensureResumeOwnership(resumeId, userId)

  if (data.templateId) {
    const template = await prisma.template.findUnique({ where: { id: data.templateId } })
    if (!template) {
      throw new AppError(400, '模板 ID 无效')
    }
  }

  const resume = await prisma.resume.update({
    where: { id: resumeId },
    data,
    include: { template: { select: { name: true } } },
  })

  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    updatedAt: resume.updatedAt,
  }
}

/** 删除简历 */
export async function deleteResume(resumeId: string, userId: string) {
  await ensureResumeOwnership(resumeId, userId, 'delete')

  await prisma.resume.delete({ where: { id: resumeId } })
  return { message: '简历已删除' }
}

/** 格式化简历数据为 API 响应格式 */
function formatResume(resume: {
  id: string
  title: string
  templateId: string
  createdAt: Date
  updatedAt: Date
  content?: { basicInfo: unknown; education: unknown; workExperience: unknown; projectExperience: unknown; skills: unknown } | null
  template?: { name: string; schemaKey: string } | null
}) {
  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    templateName: resume.template?.name,
    schemaKey: resume.template?.schemaKey,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
    content: resume.content
      ? {
          basicInfo: JSON.parse(resume.content.basicInfo as string),
          education: JSON.parse(resume.content.education as string),
          workExperience: JSON.parse(resume.content.workExperience as string),
          projectExperience: JSON.parse(resume.content.projectExperience as string),
          skills: JSON.parse(resume.content.skills as string),
        }
      : undefined,
  }
}
