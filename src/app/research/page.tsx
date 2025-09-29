export default function Research() {
  const researchAreas = [
    {
      title: "System 2 Thinking",
      description: "Developing AI systems that can engage in deliberate, analytical reasoning processes similar to human System 2 thinking.",
      details: "Our research focuses on creating computational models that can move beyond fast, intuitive responses to engage in slow, deliberate reasoning. This involves developing architectures that can pause, reflect, and systematically work through complex problems.",
      projects: [
        "Dual-Process Cognitive Architectures",
        "Deliberative Planning in Neural Networks",
        "Metacognitive Control Mechanisms"
      ],
      image: "/research-system2.jpg"
    },
    {
      title: "Complex Reasoning",
      description: "Building models capable of multi-step reasoning, logical inference, and handling complex problem-solving scenarios.",
      details: "We investigate how to enable AI systems to break down complex problems into manageable steps, maintain coherent reasoning chains, and apply logical principles consistently across diverse domains.",
      projects: [
        "Multi-Step Reasoning Frameworks",
        "Logical Inference Networks",
        "Abstract Problem Solving"
      ],
      image: "/research-reasoning.jpg"
    },
    {
      title: "Cognitive Architecture",
      description: "Exploring novel architectures that combine intuitive and deliberate processing for more human-like AI systems.",
      details: "Our work examines how to integrate different types of cognitive processes within unified architectures, balancing efficiency with sophisticated reasoning capabilities.",
      projects: [
        "Hybrid Symbolic-Neural Systems",
        "Attention-Based Reasoning Modules",
        "Memory-Augmented Architectures"
      ],
      image: "/research-architecture.jpg"
    },
    {
      title: "Meta-Learning",
      description: "Developing systems that can learn how to learn and adapt reasoning strategies dynamically.",
      details: "We research how AI systems can acquire general learning principles that transfer across tasks and domains, enabling rapid adaptation to new reasoning challenges.",
      projects: [
        "Strategy Learning Algorithms",
        "Transfer Learning for Reasoning",
        "Few-Shot Problem Solving"
      ],
      image: "/research-metalearning.jpg"
    },
    {
      title: "Causal Inference",
      description: "Building models capable of understanding and reasoning about causal relationships in complex systems.",
      details: "Our research focuses on enabling AI to understand not just correlations but true causal relationships, allowing for better prediction and intervention planning.",
      projects: [
        "Causal Discovery Algorithms",
        "Interventional Reasoning",
        "Counterfactual Inference"
      ],
      image: "/research-causal.jpg"
    },
    {
      title: "AI Safety",
      description: "Ensuring AI systems remain safe, aligned, and beneficial as they become more capable of sophisticated reasoning.",
      details: "We investigate how to maintain control and alignment as AI systems become more autonomous and capable of complex reasoning, ensuring they remain beneficial and safe.",
      projects: [
        "Interpretable Reasoning Systems",
        "Alignment Through Reasoning",
        "Safe Exploration in Complex Domains"
      ],
      image: "/research-safety.jpg"
    }
  ];

  interface ResearchArea {
    title: string;
    description: string;
    details: string;
    projects: string[];
    image: string;
  }

  const ResearchAreaCard = ({ area, index }: { area: ResearchArea, index: number }) => (
    <div className={`flex flex-col lg:flex-row gap-8 mb-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
      <div className="lg:w-1/2">
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4 lg:mb-0">
          <span className="text-gray-500 text-6xl">🔬</span>
        </div>
      </div>
      <div className="lg:w-1/2">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{area.title}</h3>
        <p className="text-gray-700 mb-4">{area.description}</p>
        <p className="text-gray-600 mb-6">{area.details}</p>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Current Projects:</h4>
          <ul className="space-y-2">
            {area.projects.map((project: string, projectIndex: number) => (
              <li key={projectIndex} className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                {project}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Research</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our research spans multiple areas of machine learning and cognitive AI, all unified by the goal
            of creating more intelligent, reasoning-capable, and safe AI systems.
          </p>
        </div>

        {/* Research Overview */}
        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Research Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold mb-3">Cognitive Inspiration</h3>
              <p className="text-gray-600">
                Drawing insights from cognitive science to build more human-like AI systems
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-3">Systematic Approach</h3>
              <p className="text-gray-600">
                Combining theoretical understanding with rigorous empirical validation
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-3">Real-World Impact</h3>
              <p className="text-gray-600">
                Developing solutions that address practical challenges and benefit society
              </p>
            </div>
          </div>
        </div>

        {/* Research Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Research Areas</h2>
          <div className="space-y-16">
            {researchAreas.map((area, index) => (
              <ResearchAreaCard key={index} area={area} index={index} />
            ))}
          </div>
        </div>

        {/* Collaboration */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Collaborative Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Interdisciplinary Partnerships</h3>
              <p className="text-gray-600 mb-4">
                We collaborate with researchers from psychology, neuroscience, philosophy, and other fields
                to ensure our AI systems are grounded in solid understanding of intelligence and reasoning.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Cognitive Science Department</li>
                <li>• Philosophy of Mind Research Group</li>
                <li>• Neuroscience Institute</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Industry Partnerships</h3>
              <p className="text-gray-600 mb-4">
                We work closely with industry partners to ensure our research has practical applications
                and addresses real-world challenges in AI deployment.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Technology Companies</li>
                <li>• AI Research Labs</li>
                <li>• Startups and Innovation Centers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Funding */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Research Funding</h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            Our research is supported by various funding agencies and organizations committed to advancing
            AI research and ensuring its beneficial development.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">National Research Foundation</h3>
              <p className="text-gray-600 text-sm">Basic Science Research Program</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">IITP</h3>
              <p className="text-gray-600 text-sm">AI Graduate School Program</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Industry Grants</h3>
              <p className="text-gray-600 text-sm">Collaborative Research Projects</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">International Funding</h3>
              <p className="text-gray-600 text-sm">Global Research Initiatives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}