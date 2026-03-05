export default function ClaimVerified() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
        <p className="text-gray-600 mb-4">
          Your email has been confirmed. We'll review your claim within 48 hours and email you once it's approved.
        </p>
        <p className="text-sm text-gray-400">You can close this tab.</p>
      </div>
    </div>
  )
}