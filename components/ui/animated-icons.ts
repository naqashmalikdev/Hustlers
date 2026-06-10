/* ════════════════════════════════════════════════════════════════
   ANIMATED ICON BARREL
   Drop-in replacement for `lucide-react` across app/content components.
   - Names that exist in the @lucide-animated registry are re-exported
     from the locally-installed animated components (hover-animated,
     built on `motion`). They render as <div><svg/></div>, take `size`
     + `className` (className lands on the wrapper div; colour inherits
     via currentColor), and animate on hover.
   - Names the registry does NOT have fall back to plain lucide-react so
     nothing breaks (e.g. ShoppingBag, Package, Trash2, Phone, Star,
     Loader2, Dumbbell, Leaf, Target, Filter, …). Zap/Star stay lucide
     on purpose — they rely on solid `fill-*`, which the animated
     (outline) variants don't support.
   shadcn UI primitives (select, dialog, dropdown, carousel, …) keep
   importing lucide-react directly — their icons are structural chrome.
   ════════════════════════════════════════════════════════════════ */

// ── Animated (aliased to their lucide names) ──
export { CartIcon as ShoppingCart } from "./cart";
export { CheckIcon as Check } from "./check";
export { PlusIcon as Plus } from "./plus";
export { ArrowLeftIcon as ArrowLeft } from "./arrow-left";
export { ArrowRightIcon as ArrowRight } from "./arrow-right";
export { SearchIcon as Search } from "./search";
export { CircleCheckIcon as CheckCircle } from "./circle-check";
export { HomeIcon as Home } from "./home";
export { XIcon as X } from "./x";
export { ChevronDownIcon as ChevronDown } from "./chevron-down";
export { ChevronUpIcon as ChevronUp } from "./chevron-up";
export { ChevronLeftIcon as ChevronLeft } from "./chevron-left";
export { ChevronRightIcon as ChevronRight } from "./chevron-right";
export { LockIcon as Lock } from "./lock";
export { ClockIcon as Clock } from "./clock";
export { UserIcon as User } from "./user";
export { UploadIcon as Upload } from "./upload";
export { TrendingUpIcon as TrendingUp } from "./trending-up";
export { FlameIcon as Flame } from "./flame";
export { HeartIcon as Heart } from "./heart";
export { TimerIcon as Timer } from "./timer";
export { MenuIcon as Menu } from "./menu";
export { LogoutIcon as LogOut } from "./logout";
export { MapPinIcon as MapPin } from "./map-pin";
export { ThermometerIcon as Thermometer } from "./thermometer";
export { WindIcon as Wind } from "./wind";

// ── Fallbacks: no animated equivalent in the registry → plain lucide ──
export {
  ShoppingBag,
  Minus,
  Package,
  Star,
  Zap,
  Loader2,
  Tag,
  Save,
  Eye,
  Send,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ImagePlus,
  AlertTriangle,
  Dumbbell,
  Target,
  Edit2,
  Filter,
  LayoutDashboard,
  BarChart3,
  ExternalLink,
  Phone,
  Navigation,
  Droplets,
  Leaf,
} from "lucide-react";
