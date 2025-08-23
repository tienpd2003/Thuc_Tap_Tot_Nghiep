import { MdHeadsetMic } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-3">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdHeadsetMic className="h-5 w-5 text-[#5e83ae]" />
            <span className="text-sm text-gray-600">TicketHub v1.0</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2024 Company ABC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}