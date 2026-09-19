import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="font-bold text-gray-900 mb-2">エラーが発生しました</p>
            <p className="text-sm text-gray-500 mb-6">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-line-green text-white px-6 py-2 rounded-xl font-medium text-sm"
            >
              再読み込み
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
