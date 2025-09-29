export interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  links?: Array<{
    text: string;
    url: string;
  }>;
}

export const newsData: NewsItem[] = [
  {
    id: '1',
    date: 'September 24, 2025',
    title: 'Paper accepted at TMLR',
    description: 'One paper accepted at TMLR2025',
    links: [
      {
        text: 'link',
        url: 'https://arxiv.org/abs/2408.16218'
      }
    ]
  },
  {
    id: '2',
    date: 'September 19, 2025',
    title: 'Three papers accepted at NeurIPS',
    description: 'Three papers (one as an oral) accepted at NeurIPS2025',
    links: [
      {
        text: '1',
        url: 'https://arxiv.org/abs/2505.23416'
      },
      {
        text: '2',
        url: 'https://arxiv.org/abs/2410.02992'
      },
      {
        text: '3',
        url: 'https://arxiv.org/abs/2509.20214'
      }
    ]
  },
  {
    id: '3',
    date: 'August 1, 2025',
    title: 'Scholarship Award',
    description: 'Jinuk Kim was selected as a recipient of Yulchon AI Star Scholarship'
  },
  {
    id: '4',
    date: 'June 9, 2025',
    title: 'Scholarship Award',
    description: 'Jinuk Kim was selected as a recipient of Presidential Science Scholarship for Graduate Students (full M.S./Ph.D.)'
  },
  {
    id: '5',
    date: 'May 13, 2025',
    title: 'Paper accepted at ICML',
    description: 'One paper accepted at ICML2025',
    links: [
      {
        text: 'link',
        url: 'https://arxiv.org/abs/2505.07004'
      }
    ]
  },
  {
    id: '6',
    date: 'May 1, 2024',
    title: 'Two papers accepted at ICML',
    description: 'Two papers accepted at ICML2024',
    links: [
      {
        text: '1',
        url: 'https://arxiv.org/abs/2406.12837'
      },
      {
        text: '2',
        url: 'https://arxiv.org/abs/2406.14876'
      }
    ]
  },
  {
    id: '7',
    date: 'January 17, 2024',
    title: 'Paper accepted at ICLR',
    description: 'One paper accepted at ICLR2024',
    links: [
      {
        text: 'link',
        url: 'https://arxiv.org/abs/2312.03414'
      }
    ]
  },
  {
    id: '8',
    date: 'September 22, 2023',
    title: 'Three papers accepted at NeurIPS',
    description: 'Three papers accepted at NeurIPS2023',
    links: [
      {
        text: '1',
        url: 'https://arxiv.org/abs/2301.12842'
      },
      {
        text: '2',
        url: 'https://arxiv.org/abs/2301.12321'
      },
      {
        text: '3',
        url: 'https://arxiv.org/abs/2307.03486'
      }
    ]
  }
];