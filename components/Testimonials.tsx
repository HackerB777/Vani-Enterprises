export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Homemaker, Mumbai',
      rating: 5,
      text: 'Outstanding quality and fast delivery! The bedsheets are premium and the customer service is excellent. Highly recommended!',
      avatar: '👩‍🦰',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Software Engineer, Bangalore',
      rating: 5,
      text: 'Amazing collection of electronics and gadgets. The prices are honest and the products are authentic. Best online shopping experience!',
      avatar: '👨‍💼',
    },
    {
      id: 3,
      name: 'Anita Patel',
      role: 'Interior Designer, Ahmedabad',
      rating: 4,
      text: 'Love the home decor items! The quality is exceptional and the variety is impressive. Will definitely order again.',
      avatar: '👩‍🎨',
    },
    {
      id: 4,
      name: 'Mohammed Hassan',
      role: 'Student, Delhi',
      rating: 5,
      text: 'Great service! I ordered a gift hamper and it arrived beautifully packaged. My friends loved it. Thanks Vani Enterprises!',
      avatar: '👨‍🎓',
    },
  ];

  return (
    <section className="bg-stone-50 border-b border-stone-100 py-12">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">What Our Customers Say</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Trusted by 10K+ Happy Customers
          </h2>
          <p className="mt-2 text-stone-600">Real reviews from real customers who love our products</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-stone-700 leading-relaxed mb-4 line-clamp-3">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{testimonial.name}</p>
                  <p className="text-xs text-stone-500 truncate">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust metrics */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { number: '10K+', label: 'Happy Customers' },
            { number: '4.8★', label: 'Average Rating' },
            { number: '500+', label: 'Products' },
            { number: '15+', label: 'Years' },
          ].map((metric) => (
            <div key={metric.label}>
              <p className="font-display text-2xl font-bold text-brand-600">{metric.number}</p>
              <p className="text-xs text-stone-600">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
