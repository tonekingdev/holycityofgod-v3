import { EventApprovalPanel } from "@/components/calendar/event-approval-panel"

export default function ApprovalsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Approvals</h1>
        <p className="text-gray-600 mt-2">
          Review and approve events for Holy City of God Christian Fellowship network
        </p>
      </div>

      <EventApprovalPanel />
    </div>
  )
}