"use client";
import Burger from "@/components/layout/header/burger";
import Nav from "@/components/layout/header/nav";
import UserMenu from "@/components/layout/header/user-menu";
import useOnScroll from "@/hooks/useOnScroll";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "@/providers/language/locale-switcher";
import { ThemeSwitcher } from "@/providers/theme/theme-switcher";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import UserAuthLinks from "./user-auth-links";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const scrollY = useOnScroll();
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <header
      className={cn("p-6 z-10 fixed w-full", {
        "bg-background": isOpen || pathname !== `/${locale}`,
        "p-2 bg-background": scrollY > 0,
      })}
    >
      <div className="mx-auto max-w-screen-lg">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/">
            <div className="flex items-center text-xl font-semibold">
              EzStart
            </div>
          </Link>
          <Nav className="hidden lg:flex" />
          {!user && (
            <UserAuthLinks setIsOpen={setIsOpen} className="hidden lg:flex" />
          )}

          <div className="flex items-center gap-2">
            {!user && (
              <>
                <LocaleSwitcher />
                <ThemeSwitcher />
              </>
            )}
            <Burger
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              className="block lg:hidden"
            />
            <UserMenu />
          </div>
        </div>
        <div
          className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden",
            { "max-h-0": !isOpen, "max-h-screen": isOpen }
          )}
        >
          <Nav />
          {!user && <UserAuthLinks setIsOpen={setIsOpen} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
