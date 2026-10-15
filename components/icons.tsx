import { FC } from "react"

const paths = {
  compare: "M4 4h7v16H4zM13 4h7v16h-7M15.5 9h2M15.5 12h2M6.5 9h2M6.5 15h2",
  text: "M4 7V4h16v3M9 20h6M12 4v16",
  unicode: "M5 20 12 4l7 16M8 14h8",
  web: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9",
  time: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2",
  dev: "m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14",
  editor: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6 6 18",
  copy: "M9 9h11v11H9zM5 15V4h11",
  check: "m5 12 5 5 9-10",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  arrow: "M5 12h14M13 6l6 6-6 6",
} as const

export type IconName = keyof typeof paths

export const Icon: FC<{ name: IconName; size?: number }> = ({
  name,
  size = 18,
}) => (
  <svg
    aria-hidden="true"
    className="icon"
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.75}
    viewBox="0 0 24 24"
    width={size}
  >
    <path d={paths[name]} />
  </svg>
)
