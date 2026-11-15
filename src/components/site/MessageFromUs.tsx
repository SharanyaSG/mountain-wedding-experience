import messageVideo from "@/assets/message-from-us.mp4.asset.json";
import messagePoster from "@/assets/message-from-us-poster.jpg.asset.json";

export function MessageFromUs() {
  return (
    <section id="message-from-us" className="section-shell section-divider scroll-mt-20 bg-background text-center md:scroll-mt-24">
      <p className="font-script text-4xl text-crimson">Sharanya &amp; Sahil</p>
      <h2 className="display mx-auto mt-8 max-w-4xl text-4xl text-foreground md:text-6xl">A Message From Us</h2>
      <div className="section-content mx-auto h-px w-16 bg-border" />
      <div className="section-content mx-auto w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px]">
        <video
          src={messageVideo.url}
          poster={messagePoster.url}
          controls
          playsInline
          preload="metadata"
          aria-label="A personal video message from Sharanya and Sahil"
          className="block h-auto w-full"
        />
      </div>
    </section>
  );
}
