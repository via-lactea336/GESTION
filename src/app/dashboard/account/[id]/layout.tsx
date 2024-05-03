import SideNav from "@/components/dashboard/SideNav";

// eslint-disable-next-line space-before-function-paren, no-undef
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>{children}</div>
    );
}