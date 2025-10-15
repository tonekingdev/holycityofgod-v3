import RemoteServiceEditor from "@/components/admin/remote-service-editor"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your church website settings and configurations</p>
      </div>

      <RemoteServiceEditor churchId={1} />
    </div>
  )
}