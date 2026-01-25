import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

export default function InviteModal({ link, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-6 rounded-lg space-y-4 w-[280px] text-center"
      >
        <h3 className="font-semibold">Invite to Room</h3>

        <QRCodeCanvas value={link} size={180} />

        <p className="text-xs text-gray-400 break-all">
          {link}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2 bg-indigo-600 rounded"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
