import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 to-stone-800 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-brand-500 blur-3xl" />
        </div>
        <div className="container relative text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-400">Our Story</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Rooted in Chennai,
            <br />
            <span className="text-brand-400">Crafted for Every Indian Home</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-400">
            Vani Enterprises has spent over 7 years curating the finest home goods from artisan communities
            across India — bringing tradition, craftsmanship and beauty to modern Indian living.
          </p>
        </div>
      </div>

      <div className="container space-y-16 py-16">
        {/* Mission */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Who We Are</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              More than a store — a celebration of Indian craft
            </h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              Founded in Chennai in 2009, Vani Enterprises began as a small collective of craft enthusiasts
              dedicated to preserving and promoting the rich heritage of Indian handcraft. What started as a
              curated selection of textiles and decor has grown into a full home-living destination trusted
              by over 12,000 families across India.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">
              Every product in our collection is handpicked directly from artisan communities — from
              Kanchipuram silk weavers to Rajasthani block-printers to brass craftsmen of Tamil Nadu.
              We believe beautiful homes should be built on honest craftsmanship.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '7+', label: 'Years of Excellence' },
              { value: '80+', label: 'Artisan Partners' },
              { value: '500+', label: 'Products Curated' },
              { value: '20K+', label: 'Happy Customers' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-soft">
                <p className="font-display text-3xl sm:text-4xl font-bold text-brand-700">{stat.value}</p>
                <p className="mt-2 text-sm text-stone-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">What We Stand For</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-stone-900">Our Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Authentic Craftsmanship', desc: 'Every product is sourced directly from skilled artisans, ensuring authenticity, fair pay, and preservation of generational knowledge.' },
              { title: 'Sustainable Practices',   desc: 'We prioritise natural materials, eco-friendly packaging, and communities that practice sustainable production.' },
              { title: 'Quality You Can Trust',   desc: 'Our quality team personally tests every product before it enters our catalog. If it is not premium, it does not make the cut.' },
              { title: 'Fair Trade',              desc: 'We work directly with artisan cooperatives, ensuring fair compensation and bypassing middlemen to keep prices honest.' },
              { title: 'Customer First',          desc: '7-day returns, easy exchanges, and a support team that genuinely cares — because your satisfaction is our priority.' },
              { title: 'Indian Heritage',         desc: 'Every product tells a story. We proudly champion the diverse craft traditions of India\'s artisan communities.' },
            ].map((val) => (
              <div key={val.title} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
                <div className="mb-3 h-8 w-8 rounded-full bg-brand-100" />
                <h3 className="font-display text-lg font-bold text-stone-900">{val.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Meet Our Team</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-stone-900">The People Behind Vani</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Arun Krishnan', role: 'Founder & CEO', bio: 'Passionate about preserving Indian craft heritage and connecting artisans with customers.' },
              { name: 'Meera Sharma', role: 'Creative Director', bio: 'Curates our product collection with an eye for quality, authenticity, and timeless design.' },
              { name: 'Vikram Nair', role: 'Operations Lead', bio: 'Ensures every order reaches customers on time with our commitment to excellence.' },
              { name: 'Priya Desai', role: 'Customer Care Lead', bio: 'Building relationships with customers and ensuring their complete satisfaction.' },
            ].map((member) => (
              <div key={member.name} className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-soft hover:shadow-md transition-shadow">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 mx-auto mb-4 text-2xl">
                  👤
                </div>
                <h3 className="font-display text-lg font-bold text-stone-900">{member.name}</h3>
                <p className="text-xs font-semibold text-brand-600 mt-1">{member.role}</p>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-brand-700 to-brand-900 px-4 sm:px-8 py-8 sm:py-12 text-center text-white">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">Ready to shop with purpose?</h2>
          <p className="mt-3 text-brand-200">
            Every purchase supports artisan livelihoods and India&apos;s craft heritage.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-50">
              Explore Collection
            </Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
