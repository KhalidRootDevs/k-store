import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpNarrowWide,
  BellRing,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircuitBoardIcon,
  Command,
  Copy,
  CreditCard,
  Dot,
  Eye,
  File,
  FileText,
  GripVertical,
  HelpCircle,
  Image,
  Laptop,
  LayoutDashboardIcon,
  List,
  Loader2,
  LogIn,
  LucideIcon,
  LucideProps,
  Moon,
  MoreVertical,
  Newspaper,
  Pencil,
  Pizza,
  Plus,
  Search,
  Send,
  Settings,
  ShoppingCart,
  SquarePlay,
  Star,
  SunMedium,
  Trash2,
  User,
  User2Icon,
  UserPen,
  UsersRound,
  UserX2Icon,
  X
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  add: Plus,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronsRight: ChevronsRight,
  chevronsLeft: ChevronsLeft,
  bellRing: BellRing,
  billing: CreditCard,
  calendar: CalendarDays,
  cart: ShoppingCart,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
  close: X,
  copy: Copy,
  dashboard: LayoutDashboardIcon,
  dot: Dot,
  eye: Eye,
  ellipsis: MoreVertical,
  employee: UserX2Icon,
  grip: GripVertical,
  help: HelpCircle,
  kanban: CircuitBoardIcon,
  laptop: Laptop,
  list: List,
  login: LogIn,
  logo: Command,
  media: Image,
  moon: Moon,
  news: Newspaper,
  page: File,
  pizza: Pizza,
  post: FileText,
  profile: User2Icon,
  pencil: Pencil,
  settings: Settings,
  spinner: Loader2,
  star: Star,
  send: Send,
  sun: SunMedium,
  search: Search,
  sortArrow: ArrowUpNarrowWide,
  delete: Trash2,
  user: User,
  userPen: UserPen,
  users: UsersRound,
  warning: AlertTriangle,
  youtube: SquarePlay,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      width="40"
      height="40"
      viewBox="-2 -2 24 24"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin"
      className="jam jam-google"
      {...props}
    >
      <path d="M4.376 8.068A6 6 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10 10 0 0 1-.044 3.956 10 10 0 0 1-3.52 5.71A9.96 9.96 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 10 10 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114" />
    </svg>
  ),
  appStore: ({ ...props }: LucideProps) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m8.809 14.92 6.11-11.037c.084-.152.168-.302.244-.459.069-.142.127-.285.165-.44.08-.326.058-.666-.066-.977a1.5 1.5 0 0 0-.62-.735 1.42 1.42 0 0 0-.922-.193c-.32.043-.613.194-.844.43-.11.11-.2.235-.283.368-.092.146-.175.298-.259.45l-.386.697-.387-.698c-.084-.151-.167-.303-.259-.449a2.2 2.2 0 0 0-.283-.369 1.45 1.45 0 0 0-.844-.429 1.42 1.42 0 0 0-.921.193 1.5 1.5 0 0 0-.62.735 1.6 1.6 0 0 0-.066.977c.038.155.096.298.164.44.076.157.16.307.244.459l1.248 2.254-4.862 8.782H2.029c-.167 0-.335 0-.502.01-.152.009-.3.028-.448.071-.31.09-.582.28-.778.548A1.58 1.58 0 0 0 .3 17.404c.197.268.468.457.779.548.148.043.296.062.448.071.167.01.335.01.503.01h13.097a2 2 0 0 0 .1-.27c.415-1.416-.616-2.844-2.035-2.844zm-5.696 3.622-.792 1.5c-.082.156-.165.31-.239.471a2.4 2.4 0 0 0-.16.452 1.7 1.7 0 0 0 .064 1.003c.121.318.334.583.607.755s.589.242.901.197c.314-.044.6-.198.826-.44.108-.115.196-.242.278-.378.09-.15.171-.306.253-.462L6 19.464c-.09-.15-.947-1.47-2.887-.922m20.586-3.006a1.47 1.47 0 0 0-.779-.54 2 2 0 0 0-.448-.071c-.168-.01-.335-.01-.503-.01h-3.321L14.258 7.1a4.06 4.06 0 0 0-1.076 2.198 4.64 4.64 0 0 0 .546 3l5.274 9.393c.084.15.167.3.259.444.084.13.174.253.283.364.231.232.524.38.845.423s.643-.024.922-.19a1.5 1.5 0 0 0 .621-.726c.125-.307.146-.642.066-.964a2.2 2.2 0 0 0-.165-.434c-.075-.155-.16-.303-.244-.453l-1.216-2.166h1.596c.168 0 .335 0 .503-.009.152-.009.3-.028.448-.07a1.47 1.47 0 0 0 .78-.541 1.54 1.54 0 0 0 .3-.916 1.54 1.54 0 0 0-.3-.916z" />
    </svg>
  )
};
