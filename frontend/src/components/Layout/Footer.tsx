import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

export default function Footer() {
  return (
    <AntFooter className="text-center text-gray-500 text-sm bg-white border-t border-gray-100 py-4">
      © {new Date().getFullYear()} IntelliResume — 智能简历生成平台
    </AntFooter>
  )
}
