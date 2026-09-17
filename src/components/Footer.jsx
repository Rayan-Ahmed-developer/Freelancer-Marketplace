import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#07090E] border-t border-slate-800/80 py-12 px-6 md:px-16 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Workly Enterprise</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Elite freelance management and project execution platform for high-stakes enterprise engagements.
          </p>
          <p className="text-xs text-slate-600 mt-6">© 2026 Workly Enterprise. All rights reserved.</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/projects" className="hover:text-cyan-400 transition">Find Work</Link></li>
              <li><Link href="/projects/create" className="hover:text-cyan-400 transition">Post Project</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-cyan-400 transition">Talent Directory</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition">Enterprise Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition">Security</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}