"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative border-t border-[#111412]/10 bg-[#f5f2ea] py-12"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm font-medium text-[#4d5549]">
            © {new Date().getFullYear()} Crew Rostering. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#4d5549]">
              <span className="opacity-60">Developed by</span>
              <a
                href="https://github.com/kartikgulati"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#111412] transition-colors hover:text-[#6f8d23] font-bold"
              >
                Kartik Gulati
              </a>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-[#111412]/10">
              <a
                href="https://github.com/kartikgulati"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4d5549] transition-colors hover:text-[#111412]"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.464-1.334-5.464-5.93 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/kartikgulati"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4d5549] transition-colors hover:text-[#111412]"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/kartikgulati"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4d5549] transition-colors hover:text-[#111412]"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24 " >
 
  <path fill="#4d5549" fill-rule="evenodd" d="M5 1C2.79086 1 1 2.79086 1 5v14c0 2.2091 1.79086 4 4 4h14c2.2091 0 4 -1.7909 4 -4V5c0 -2.20914 -1.7909 -4 -4 -4H5Zm-0.33429 3.5c-0.17536 0.06527 -0.32332 0.19509 -0.40968 0.3683 -0.12689 0.2545 -0.09892 0.55889 0.07223 0.78601l5.61418 7.45029 -5.91591 6.344c-0.01551 0.0167 -0.03011 0.0338 -0.04382 0.0514h2.04691l4.82948 -5.179 3.7133 4.9278c0.0871 0.1155 0.2043 0.2018 0.3364 0.2512h4.4223c0.1748 -0.0654 0.3224 -0.195 0.4085 -0.3679 0.1269 -0.2545 0.099 -0.5589 -0.0722 -0.786l-5.6142 -7.4503L20.0173 4.5h-2.051l-4.8298 5.17932 -3.7133 -4.92774c-0.08729 -0.11583 -0.20496 -0.20227 -0.3375 -0.25158H4.66571ZM15.5454 18.0475 6.4315 5.95294h2.01878L17.5642 18.0475h-2.0188Z" clip-rule="evenodd" stroke-width="1"></path>
</svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
