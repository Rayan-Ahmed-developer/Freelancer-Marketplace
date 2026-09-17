// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Send, Calendar, Loader2, Paperclip, FileText } from "lucide-react";

// // Platform fee
// const PLATFORM_FEE_PERCENT = 10;

// export default function ProposalModal({
//   isOpen,
//   onClose,
//   projectId = null,
//   freelancerId = null,
// }) {
//   const [bidAmount, setBidAmount] = useState("");
//   const [deliveryTime, setDeliveryTime] = useState("");
//   const [coverLetter, setCoverLetter] = useState("");
//   const [attachments, setAttachments] = useState([]);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   if (!isOpen) return null;

//   // Bid amount
//   const numericBid = Number(bidAmount) || 0;

//   // Platform fee
//   const platformFee =
//     numericBid > 0
//       ? Number(((numericBid * PLATFORM_FEE_PERCENT) / 100).toFixed(2))
//       : 0;

//   // Freelancer receives
//   const youwillReceive =
//     numericBid > 0 ? Number((numericBid - platformFee).toFixed(2)) : 0;

//   const handleAttachmentChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     setAttachments(files);
//   };

//   const resetForm = () => {
//     setBidAmount("");
//     setDeliveryTime("");
//     setCoverLetter("");
//     setAttachments([]);
//     setError("");
//   };

//   const handleClose = () => {
//     if (isSubmitting) return;

//     resetForm();
//     onClose();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // Project ID check
//     if (!projectId) {
//       setError("Project information is missing.");
//       return;
//     }

//     // Freelancer ID check
//     if (!freelancerId) {
//       setError("Freelancer information is missing.");
//       return;
//     }

//     // Bid validation
//     if (!bidAmount || numericBid <= 0) {
//       setError("Please enter a valid bid amount.");
//       return;
//     }

//     // Delivery validation
//     if (!deliveryTime.trim()) {
//       setError("Please enter your delivery time.");
//       return;
//     }

//     // Cover letter validation
//     if (coverLetter.trim().length < 20) {
//       setError("Cover letter must contain at least 20 characters.");
//       return;
//     }

//     if (coverLetter.trim().length > 2000) {
//       setError("Cover letter cannot exceed 2000 characters.");
//       return;
//     }

//     // Schema-compatible payload
//     const payload = {
//       projectId,
//       freelancerId,
//       bidAmount: numericBid,
//       platformFee,
//       youwillReceive,
//       deliveryTime: deliveryTime.trim(),
//       coverLetter: coverLetter.trim(),

//       // Attachments are optional
//       attachments: [],
//     };

//     try {
//       setIsSubmitting(true);

//       // Abhi sirf testing ke liye
//       console.log("Proposal Payload:", payload);

//       await new Promise((resolve) => setTimeout(resolve, 800));

//       alert("Proposal submitted successfully!");

//       resetForm();
//       onClose();
//     } catch (error) {
//       setError(error.message || "Something went wrong.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-28 bg-slate-950/80 backdrop-blur-sm overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//         <motion.div
//           initial={{
//             opacity: 0,
//             scale: 0.95,
//             y: 20,
//           }}
//           animate={{
//             opacity: 1,
//             scale: 1,
//             y: 0,
//           }}
//           exit={{
//             opacity: 0,
//             scale: 0.95,
//             y: 20,
//           }}
//           transition={{
//             duration: 0.3,
//             ease: "easeOut",
//           }}
//           className="bg-[#131B2E] border border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative text-slate-100 my-auto"
//         >
//           {/* Close Button */}
//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isSubmitting}
//             className="absolute top-6 right-6 text-slate-400 hover:text-white transition bg-slate-800/80 p-2 rounded-full border border-slate-700 cursor-pointer disabled:opacity-50"
//           >
//             <X size={18} />
//           </button>

//           {/* Header */}
//           <div className="mb-7 pr-10">
//             <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
//               Freelancer Proposal
//             </span>

//             <h2 className="text-2xl font-bold text-white mt-1">
//               Submit Your Proposal
//             </h2>

//             <p className="text-sm text-slate-400 mt-2">
//               Provide your bid, delivery timeline and cover letter for this
//               project.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Bid Amount + Delivery Time */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Bid Amount */}
//               <div>
//                 <label className="block text-xs font-medium text-slate-300 mb-2">
//                   Bid Amount (PKR)
//                   <span className="text-red-400 ml-1">*</span>
//                 </label>

//                 <div className="relative flex items-center">
//                   <span className="absolute left-3 text-slate-400 text-sm font-medium">
//                     PKR
//                   </span>

//                   <input
//                     type="number"
//                     min="1"
//                     step="1"
//                     value={bidAmount}
//                     onChange={(e) => setBidAmount(e.target.value)}
//                     placeholder="50000"
//                     required
//                     disabled={isSubmitting}
//                     className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
//                   />
//                 </div>

//                 <p className="text-[11px] text-slate-500 mt-1.5">
//                   Enter the total amount you want to charge the client.
//                 </p>
//               </div>

//               {/* Delivery Time */}
//               <div>
//                 <label className="block text-xs font-medium text-slate-300 mb-2">
//                   Delivery Time
//                   <span className="text-red-400 ml-1">*</span>
//                 </label>

//                 <div className="relative flex items-center">
//                   <Calendar
//                     size={16}
//                     className="absolute left-3 text-slate-400"
//                   />

//                   <input
//                     type="text"
//                     value={deliveryTime}
//                     onChange={(e) => setDeliveryTime(e.target.value)}
//                     placeholder="e.g. 4 Weeks"
//                     required
//                     disabled={isSubmitting}
//                     className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Fee Breakdown */}
//             {numericBid > 0 && (
//               <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4">
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-slate-400">Your Bid</span>

//                   <span className="text-white font-medium">
//                     PKR {numericBid.toLocaleString("en-PK")}
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-sm mb-3">
//                   <span className="text-slate-400">
//                     Platform Fee ({PLATFORM_FEE_PERCENT}%)
//                   </span>

//                   <span className="text-slate-300">
//                     - PKR {platformFee.toLocaleString("en-PK")}
//                   </span>
//                 </div>

//                 <div className="border-t border-slate-800 pt-3 flex justify-between">
//                   <span className="text-slate-200 font-semibold">
//                     You will receive
//                   </span>

//                   <span className="text-cyan-400 font-bold">
//                     PKR {youwillReceive.toLocaleString("en-PK")}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* Cover Letter */}
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <label className="block text-xs font-medium text-slate-300">
//                   Cover Letter & Approach
//                   <span className="text-red-400 ml-1">*</span>
//                 </label>

//                 <span className="text-[11px] text-slate-500">
//                   {coverLetter.length}/2000
//                 </span>
//               </div>

//               <textarea
//                 rows={6}
//                 value={coverLetter}
//                 onChange={(e) => setCoverLetter(e.target.value)}
//                 placeholder="Explain why you are the right freelancer for this project and how you will approach the work..."
//                 required
//                 minLength={20}
//                 maxLength={2000}
//                 disabled={isSubmitting}
//                 className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition resize-none disabled:opacity-50"
//               />

//               <p className="text-[11px] text-slate-500 mt-1.5">
//                 Minimum 20 characters and maximum 2000 characters.
//               </p>
//             </div>

//             {/* Attachments */}
//             <div>
//               <label className="block text-xs font-medium text-slate-300 mb-2">
//                 Attachments
//                 <span className="text-slate-500 ml-1">(Optional)</span>
//               </label>

//               <label className="flex items-center gap-3 bg-[#0B0F19] border border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-4 cursor-pointer transition">
//                 <div className="bg-slate-800 p-2 rounded-lg">
//                   <Paperclip size={17} className="text-cyan-400" />
//                 </div>

//                 <div>
//                   <p className="text-sm text-slate-300">
//                     Attach supporting files
//                   </p>

//                   <p className="text-[11px] text-slate-500">
//                     Optional files related to your proposal
//                   </p>
//                 </div>

//                 <input
//                   type="file"
//                   multiple
//                   className="hidden"
//                   onChange={handleAttachmentChange}
//                   disabled={isSubmitting}
//                 />
//               </label>

//               {attachments.length > 0 && (
//                 <div className="mt-3 space-y-2">
//                   {attachments.map((file, index) => (
//                     <div
//                       key={`${file.name}-${index}`}
//                       className="flex items-center gap-3 bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2"
//                     >
//                       <FileText size={15} className="text-cyan-400" />

//                       <span className="text-xs text-slate-300 truncate">
//                         {file.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
//                 {error}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="pt-2 flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 disabled={isSubmitting}
//                 className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-700 cursor-pointer disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition shadow-lg shadow-cyan-500/20 flex items-center cursor-pointer disabled:opacity-60"
//               >
//                 {isSubmitting ? (
//                   <>
//                     Sending
//                     <Loader2 size={16} className="ml-2 animate-spin" />
//                   </>
//                 ) : (
//                   <>
//                     Send Proposal
//                     <Send size={16} className="ml-2" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// }

"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  X,
  Send,
  Calendar,
  Loader2,
  Paperclip,
  FileText,
} from "lucide-react";

// =========================
// PLATFORM FEE
// =========================
const PLATFORM_FEE_PERCENT = 10;

export default function ProposalModal({
  isOpen,
  onClose,
  projectId = null,
}) {
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [attachments, setAttachments] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  // =========================
  // BID CALCULATION
  // =========================

  const numericBid = Number(bidAmount) || 0;

  const platformFee =
    numericBid > 0
      ? Number(
          (
            (numericBid * PLATFORM_FEE_PERCENT) /
            100
          ).toFixed(2)
        )
      : 0;

  const youwillReceive =
    numericBid > 0
      ? Number(
          (numericBid - platformFee).toFixed(2)
        )
      : 0;

  // =========================
  // ATTACHMENTS
  // =========================

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files || []);

    setAttachments(files);
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setBidAmount("");
    setDeliveryTime("");
    setCoverLetter("");
    setAttachments([]);
    setError("");
    setSuccess("");
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  // =========================
  // SUBMIT PROPOSAL
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // PROJECT ID
    // =========================

    if (!projectId) {
      setError("Project information is missing.");
      return;
    }

    // =========================
    // BID VALIDATION
    // =========================

    if (!bidAmount || numericBid <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }

    // =========================
    // DELIVERY VALIDATION
    // =========================

    if (!deliveryTime.trim()) {
      setError("Please enter your delivery time.");
      return;
    }

    // =========================
    // COVER LETTER VALIDATION
    // =========================

    if (coverLetter.trim().length < 20) {
      setError(
        "Cover letter must contain at least 20 characters."
      );
      return;
    }

    if (coverLetter.trim().length > 2000) {
      setError(
        "Cover letter cannot exceed 2000 characters."
      );
      return;
    }

    // =========================
    // GET JWT TOKEN
    // =========================

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "You must be logged in as a freelancer to submit a proposal."
      );
      return;
    }

    // =========================
    // PAYLOAD
    // =========================
    // freelancerId is intentionally
    // NOT sent from frontend.
    //
    // Backend gets freelancerId
    // from JWT.
    // =========================

    const payload = {
      projectId,
      bidAmount: numericBid,
      platformFee,
      youwillReceive,
      deliveryTime: deliveryTime.trim(),
      coverLetter: coverLetter.trim(),

      // Attachments are currently
      // optional and not uploaded.
      attachments: [],
    };

    try {
      setIsSubmitting(true);

      console.log(
        "Submitting Proposal:",
        payload
      );

      // =========================
      // API REQUEST
      // =========================

      const response = await fetch(
        "/api/proposals",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log(
        "Proposal API Response:",
        data
      );

      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to submit proposal"
        );
      }

      // =========================
      // SUCCESS
      // =========================

      setSuccess(
        data.message ||
          "Proposal submitted successfully!"
      );

      alert(
        data.message ||
          "Proposal submitted successfully!"
      );

      resetForm();
      onClose();
    } catch (error) {
      console.error(
        "Submit Proposal Error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while submitting the proposal."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-28 bg-slate-950/80 backdrop-blur-sm overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="bg-[#131B2E] border border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative text-slate-100 my-auto"
        >

          {/* =========================
              CLOSE BUTTON
          ========================= */}

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition bg-slate-800/80 p-2 rounded-full border border-slate-700 cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>

          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-7 pr-10">

            <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Freelancer Proposal
            </span>

            <h2 className="text-2xl font-bold text-white mt-1">
              Submit Your Proposal
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Provide your bid, delivery timeline and
              cover letter for this project.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =========================
                BID + DELIVERY
            ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* BID AMOUNT */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Bid Amount (PKR)
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <div className="relative flex items-center">

                  <span className="absolute left-3 text-slate-400 text-sm font-medium">
                    PKR
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={bidAmount}
                    onChange={(e) =>
                      setBidAmount(e.target.value)
                    }
                    placeholder="50000"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                  />

                </div>

                <p className="text-[11px] text-slate-500 mt-1.5">
                  Enter the total amount you want to
                  charge the client.
                </p>

              </div>

              {/* DELIVERY TIME */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Delivery Time
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <div className="relative flex items-center">

                  <Calendar
                    size={16}
                    className="absolute left-3 text-slate-400"
                  />

                  <input
                    type="text"
                    value={deliveryTime}
                    onChange={(e) =>
                      setDeliveryTime(e.target.value)
                    }
                    placeholder="e.g. 4 Weeks"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                  />

                </div>

              </div>

            </div>

            {/* =========================
                FEE BREAKDOWN
            ========================= */}

            {numericBid > 0 && (
              <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4">

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-slate-400">
                    Your Bid
                  </span>

                  <span className="text-white font-medium">
                    PKR{" "}
                    {numericBid.toLocaleString(
                      "en-PK"
                    )}
                  </span>

                </div>

                <div className="flex justify-between text-sm mb-3">

                  <span className="text-slate-400">
                    Platform Fee ({PLATFORM_FEE_PERCENT}%)
                  </span>

                  <span className="text-slate-300">
                    - PKR{" "}
                    {platformFee.toLocaleString(
                      "en-PK"
                    )}
                  </span>

                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between">

                  <span className="text-slate-200 font-semibold">
                    You will receive
                  </span>

                  <span className="text-cyan-400 font-bold">
                    PKR{" "}
                    {youwillReceive.toLocaleString(
                      "en-PK"
                    )}
                  </span>

                </div>

              </div>
            )}

            {/* =========================
                COVER LETTER
            ========================= */}

            <div>

              <div className="flex justify-between items-center mb-2">

                <label className="block text-xs font-medium text-slate-300">
                  Cover Letter & Approach
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <span className="text-[11px] text-slate-500">
                  {coverLetter.length}/2000
                </span>

              </div>

              <textarea
                rows={6}
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
                placeholder="Explain why you are the right freelancer for this project and how you will approach the work..."
                required
                minLength={20}
                maxLength={2000}
                disabled={isSubmitting}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition resize-none disabled:opacity-50"
              />

              <p className="text-[11px] text-slate-500 mt-1.5">
                Minimum 20 characters and maximum 2000
                characters.
              </p>

            </div>

            {/* =========================
                ATTACHMENTS
            ========================= */}

            <div>

              <label className="block text-xs font-medium text-slate-300 mb-2">
                Attachments
                <span className="text-slate-500 ml-1">
                  (Optional)
                </span>
              </label>

              <label className="flex items-center gap-3 bg-[#0B0F19] border border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-4 cursor-pointer transition">

                <div className="bg-slate-800 p-2 rounded-lg">
                  <Paperclip
                    size={17}
                    className="text-cyan-400"
                  />
                </div>

                <div>

                  <p className="text-sm text-slate-300">
                    Attach supporting files
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Optional files related to your
                    proposal
                  </p>

                </div>

                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={
                    handleAttachmentChange
                  }
                  disabled={isSubmitting}
                />

              </label>

              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">

                  {attachments.map(
                    (file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-3 bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2"
                      >

                        <FileText
                          size={15}
                          className="text-cyan-400"
                        />

                        <span className="text-xs text-slate-300 truncate">
                          {file.name}
                        </span>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

            {/* =========================
                SUCCESS
            ========================= */}

            {success && (
              <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* =========================
                BUTTONS
            ========================= */}

            <div className="pt-2 flex justify-end gap-3">

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-700 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition shadow-lg shadow-cyan-500/20 flex items-center cursor-pointer disabled:opacity-60"
              >

                {isSubmitting ? (
                  <>
                    Sending
                    <Loader2
                      size={16}
                      className="ml-2 animate-spin"
                    />
                  </>
                ) : (
                  <>
                    Send Proposal
                    <Send
                      size={16}
                      className="ml-2"
                    />
                  </>
                )}

              </button>

            </div>

          </form>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}