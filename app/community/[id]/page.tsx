import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import PostDetail from "./PostDetail";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeHeader />
      <main style={{ flex: 1, paddingTop: "68px" }}>
        <PostDetail id={id} />
      </main>
      <HomeFooter />
    </div>
  );
}
