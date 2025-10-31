export default function News() {
  const newsItems = [
    {
      date: "2024-09-15",
      title: "Paper Accepted at NeurIPS 2024",
      category: "Publication",
      content: "Our paper 'System 2 Reasoning in Large Language Models: A Cognitive Architecture Approach' has been accepted at NeurIPS 2024. This work presents a novel framework for enabling deliberate reasoning in LLMs.",
      link: "/publications",
      featured: true
    },
    {
      date: "2024-08-30",
      title: "New PhD Student Joins the Lab",
      category: "People",
      content: "We welcome our new PhD student who will be working on meta-learning for complex reasoning tasks. They bring strong experience in cognitive modeling and neural networks.",
      link: "/people",
      featured: false
    },
    {
      date: "2024-08-20",
      title: "Collaboration with Industry Partner",
      category: "Research",
      content: "We have started a new collaboration with a leading tech company to develop practical applications of System 2 thinking in real-world AI systems.",
      link: "/research",
      featured: false
    },
    {
      date: "2024-08-01",
      title: "Korea University System 2 ML Lab Officially Launched",
      category: "Announcement",
      content: "We are excited to announce the official launch of Korea University System 2 ML Lab. Our mission is to advance machine learning through cognitive-inspired approaches to reasoning and intelligence.",
      link: "/about",
      featured: true
    },
    {
      date: "2024-07-25",
      title: "Presentation at ICML 2024",
      category: "Conference",
      content: "Our team presented our work on 'Meta-Learning for Complex Reasoning Tasks' at ICML 2024 in Vienna. The presentation received great feedback from the community.",
      link: "/publications",
      featured: false
    },
    {
      date: "2024-07-10",
      title: "Grant Funding Awarded",
      category: "Funding",
      content: "We have been awarded a significant research grant from the National Research Foundation to support our work on cognitive architectures for AI systems.",
      link: "/research",
      featured: false
    },
    {
      date: "2024-06-15",
      title: "Workshop on System 2 Thinking",
      category: "Event",
      content: "Successfully organized and hosted a workshop on 'System 2 Thinking in AI' at Korea University, bringing together researchers from various institutions.",
      link: "#",
      featured: false
    },
    {
      date: "2024-05-30",
      title: "Master's Student Thesis Defense",
      category: "Academic",
      content: "Congratulations to our master's student on successfully defending their thesis on 'Symbolic Reasoning Integration in Neural Networks'.",
      link: "/people",
      featured: false
    }
  ];

  interface NewsItem {
    date: string;
    title: string;
    category: string;
    content: string;
    link: string;
    featured: boolean;
  }

  const NewsCard = ({ item, featured = false }: { item: NewsItem, featured?: boolean }) => (
    <div className={`border rounded-lg p-6 ${featured ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} mb-6`}>
      {featured && (
        <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
          Featured
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <span className="text-gray-500 text-sm">{new Date(item.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.category === 'Publication' ? 'bg-green-100 text-green-800' :
          item.category === 'People' ? 'bg-purple-100 text-purple-800' :
          item.category === 'Research' ? 'bg-blue-100 text-blue-800' :
          item.category === 'Announcement' ? 'bg-red-100 text-red-800' :
          item.category === 'Conference' ? 'bg-yellow-100 text-yellow-800' :
          item.category === 'Funding' ? 'bg-orange-100 text-orange-800' :
          item.category === 'Event' ? 'bg-indigo-100 text-indigo-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.category}
        </span>
      </div>
      <h3 className={`font-semibold mb-3 ${featured ? 'text-xl' : 'text-lg'}`}>
        {item.title}
      </h3>
      <p className="text-gray-700 mb-4">{item.content}</p>
      {item.link && (
        <a
          href={item.link}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Learn more →
        </a>
      )}
    </div>
  );

  const featuredNews = newsItems.filter(item => item.featured);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">News & Updates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest developments, achievements, and announcements
            from Korea University System 2 ML Lab.
          </p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured News</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.map((item, index) => (
                <NewsCard key={index} item={item} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All News */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All News</h2>

          {/* News Categories Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              All
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              Publications
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              Research
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              People
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              Events
            </button>
          </div>

          {/* News List */}
          <div className="space-y-6">
            {newsItems.map((item, index) => (
              <NewsCard key={index} item={item} />
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest updates about our research, publications, and events delivered
            directly to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Archive */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking for Older News?</h2>
          <p className="text-gray-600 mb-6">
            Browse our complete news archive to see our journey since the lab&apos;s inception.
          </p>
          <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            View Archive
          </button>
        </div>
      </div>
    </div>
  );
}