export default function NoStore() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No store linked to your account</h1>
        <p className="text-gray-600 mb-4">Your account isn't linked to a store yet. If you recently had a claim approved, contact us.</p>
        <a href="mailto:admin@lfsdirectory.com" className="text-[#4A90D9] underline text-sm">admin@lfsdirectory.com</a>
      </div>
    </div>
  )
}