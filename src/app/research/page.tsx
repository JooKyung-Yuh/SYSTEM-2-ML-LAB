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

export default function Research() {
  const researchAreas: ResearchArea[] = [
    {
      title: "Large Language Model Reasoning",
      description: "Advancing reasoning capabilities in large language models for complex problem solving and deliberate thinking.",
      details: "We develop methods to enhance the reasoning capabilities of large language models (LLMs) through systematic approaches to problem decomposition, verification, and iterative refinement. Our work focuses on enabling LLMs to tackle complex multi-step reasoning tasks that require planning, logical inference, and mathematical problem-solving.",
      projects: [
        "Chain-of-Thought Prompting and Reasoning Strategies",
        "Self-Verification and Error Correction Mechanisms",
        "Multi-Step Problem Decomposition and Planning",
        "Integration of External Knowledge and Tools"
      ],
      image: "/research-llm.jpg"
    },
    {
      title: "System 2 Deep Learning",
      description: "Developing deliberate, slow, and logical thinking processes in neural networks inspired by human cognition.",
      details: "Inspired by human cognition (Kahneman's System 1/System 2), we develop neural architectures that can perform deliberate, reflective reasoning rather than just fast, intuitive pattern matching. This involves creating models that can engage in planning, hypothesis testing, and logical inference.",
      projects: [
        "Neural-Symbolic Integration for Logical Reasoning",
        "Iterative Refinement and Self-Correction",
        "Explicit Planning and Search in Neural Networks",
        "Cognitive Architectures for AI Systems"
      ],
      image: "/research-system2.jpg"
    },
    {
      title: "Meta-Learning / Bi-level Optimization",
      description: "Learning to learn: algorithms that can quickly adapt to new tasks and domains with minimal data.",
      details: "Meta-learning enables AI systems to rapidly adapt to new tasks with minimal data by learning from prior experience across multiple related tasks. Our research focuses on developing efficient meta-learning algorithms through bi-level optimization that can generalize across diverse problem domains.",
      projects: [
        "Few-Shot Learning and Rapid Adaptation",
        "Online Hyperparameter Meta-Learning",
        "Hypergradient-Based Optimization",
        "Task Distribution Modeling and Transfer"
      ],
      image: "/research-metalearning.jpg"
    },
    {
      title: "AutoML / Hyperparameter Optimization",
      description: "Automated machine learning for efficient model design, hyperparameter tuning, and neural architecture search.",
      details: "We develop automated approaches to machine learning that reduce the need for manual tuning and expert knowledge. Our research focuses on efficient methods for hyperparameter optimization using Bayesian optimization, freeze-thaw strategies, and cost-sensitive approaches.",
      projects: [
        "Bayesian Optimization for Hyperparameter Tuning",
        "Cost-Sensitive Freeze-Thaw Optimization",
        "Neural Architecture Search (NAS)",
        "Neural Scaling Laws Extrapolation"
      ],
      image: "/research-automl.jpg"
    },
    {
      title: "Bayesian Inference and Learning",
      description: "Principled uncertainty quantification and probabilistic reasoning in machine learning systems.",
      details: "We develop Bayesian methods for machine learning that provide principled approaches to uncertainty quantification, model selection, and decision-making under uncertainty. Our work enables AI systems to express confidence in their predictions and make robust decisions.",
      projects: [
        "Variational Inference and Approximation Methods",
        "Bayesian Neural Networks and Deep Ensembles",
        "Uncertainty Quantification and Calibration",
        "Bayesian Meta-Learning for Imbalanced Tasks"
      ],
      image: "/research-bayesian.jpg"
    },
    {
      title: "Generative Flow Networks (GFlowNet)",
      description: "Novel generative models for sampling diverse high-reward candidates from complex distributions.",
      details: "Generative Flow Networks (GFlowNets) are a new class of generative models that learn to sample objects proportionally to a reward function. Unlike traditional RL, GFlowNets can generate diverse high-reward candidates, making them particularly useful for scientific discovery and combinatorial optimization.",
      projects: [
        "Efficient Training Algorithms for GFlowNets",
        "Local Objectives for Amortized Inference (Delta-AI)",
        "Applications to Drug Discovery and Materials Science",
        "Theoretical Foundations and Convergence Analysis"
      ],
      image: "/research-gflownet.jpg"
    },
    {
      title: "Transfer / Multi-Task / Continual Learning",
      description: "Enabling knowledge transfer across tasks and continuous learning without catastrophic forgetting.",
      details: "We research how to enable AI systems to transfer knowledge across related tasks, learn multiple tasks simultaneously, and continuously adapt to new information without forgetting previous knowledge. This includes developing regularization methods and meta-learning approaches for lifelong learning.",
      projects: [
        "Sequential Reptile for Multilingual Learning",
        "Continual Trajectory Shifting",
        "Meta-Learned Transferable Regularizers",
        "Deep Asymmetric Multi-Task Feature Learning"
      ],
      image: "/research-transfer.jpg"
    }
  ];

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