import { render, screen, fireEvent } from '@testing-library/react';
import FAQPage from '@/app/faq/page';
import { useI18n } from '@/app/i18n/I18nProvider';

jest.mock('@/app/i18n/I18nProvider', () => ({
  useI18n: jest.fn(),
}));

describe('FAQ Page', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'faq.title': 'Frequently Asked Questions',
      'faq.subtitle': 'Everything you need to know about buying at GT AutoMarket.',
      'faq.notFound': "Can't find your answer?",
      'faq.contactUs': 'Contact Us',
      'faq.q1': 'What documents do I need to buy a vehicle?',
      'faq.a1': 'ID card, proof of income or employment certification...',
      'faq.q2': 'Do you offer financing and what are the terms?',
      'faq.a2': 'Yes, we work with partner entities...',
      'faq.q3': 'Can I schedule a test drive?',
      'faq.a3': 'Of course. You can schedule from the Visit page...',
      'faq.q4': 'Do the vehicles come with warranty?',
      'faq.a4': 'Yes. New vehicles with manufacturer warranty...',
      'faq.q5': 'Do you accept used vehicles as trade-in?',
      'faq.a5': 'Yes, we do professional appraisal...',
      'faq.q6': 'What is the purchase process?',
      'faq.a6': 'Vehicle selection, verification, reservation...',
      'faq.q7': 'How does vehicle reservation work?',
      'faq.a7': 'You can reserve with a refundable deposit...',
      'faq.q8': 'Do you ship to other cities?',
      'faq.a8': 'Yes. We coordinate insured transport...',
      'faq.q9': 'What payment methods do you accept?',
      'faq.a9': 'Bank transfer, deposit, cards...',
      'faq.q10': 'How can I contact after-sales support?',
      'faq.a10': 'Through our contact form, WhatsApp...',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    (useI18n as jest.Mock).mockReturnValue({
      t: mockT,
      locale: 'en',
      setLocale: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders FAQ page with title and subtitle', () => {
    render(<FAQPage />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('Everything you need to know about buying at GT AutoMarket.')).toBeInTheDocument();
  });

  it('renders all 10 FAQ questions', () => {
    render(<FAQPage />);
    
    expect(screen.getByText('What documents do I need to buy a vehicle?')).toBeInTheDocument();
    expect(screen.getByText('Do you offer financing and what are the terms?')).toBeInTheDocument();
    expect(screen.getByText('Can I schedule a test drive?')).toBeInTheDocument();
    expect(screen.getByText('Do the vehicles come with warranty?')).toBeInTheDocument();
    expect(screen.getByText('Do you accept used vehicles as trade-in?')).toBeInTheDocument();
    expect(screen.getByText('What is the purchase process?')).toBeInTheDocument();
    expect(screen.getByText('How does vehicle reservation work?')).toBeInTheDocument();
    expect(screen.getByText('Do you ship to other cities?')).toBeInTheDocument();
    expect(screen.getByText('What payment methods do you accept?')).toBeInTheDocument();
    expect(screen.getByText('How can I contact after-sales support?')).toBeInTheDocument();
  });

  it('does not show answers initially', () => {
    render(<FAQPage />);
    
    expect(screen.queryByText('ID card, proof of income or employment certification...')).not.toBeInTheDocument();
  });

  it('shows answer when question is clicked', () => {
    render(<FAQPage />);
    
    const question = screen.getByText('What documents do I need to buy a vehicle?');
    fireEvent.click(question);
    
    expect(screen.getByText('ID card, proof of income or employment certification...')).toBeInTheDocument();
  });

  it('hides answer when question is clicked again', () => {
    render(<FAQPage />);
    
    const question = screen.getByText('What documents do I need to buy a vehicle?');
    
    // Open
    fireEvent.click(question);
    expect(screen.getByText('ID card, proof of income or employment certification...')).toBeInTheDocument();
    
    // Close
    fireEvent.click(question);
    expect(screen.queryByText('ID card, proof of income or employment certification...')).not.toBeInTheDocument();
  });

  it('shows only one answer at a time', () => {
    render(<FAQPage />);
    
    const question1 = screen.getByText('What documents do I need to buy a vehicle?');
    const question2 = screen.getByText('Do you offer financing and what are the terms?');
    
    // Open first question
    fireEvent.click(question1);
    expect(screen.getByText('ID card, proof of income or employment certification...')).toBeInTheDocument();
    
    // Open second question
    fireEvent.click(question2);
    expect(screen.getByText('Yes, we work with partner entities...')).toBeInTheDocument();
    expect(screen.queryByText('ID card, proof of income or employment certification...')).not.toBeInTheDocument();
  });

  it('displays + icon when answer is closed', () => {
    render(<FAQPage />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('+');
  });

  it('displays − icon when answer is open', () => {
    render(<FAQPage />);
    
    const question = screen.getByText('What documents do I need to buy a vehicle?');
    const button = question.closest('button');
    
    fireEvent.click(button!);
    expect(button).toHaveTextContent('−');
  });

  it('renders contact us section at the bottom', () => {
    render(<FAQPage />);
    
    expect(screen.getByText("Can't find your answer?")).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('contact us link has correct href', () => {
    render(<FAQPage />);
    
    const contactLink = screen.getByRole('link', { name: /contact us/i });
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('calls all translation keys correctly', () => {
    render(<FAQPage />);
    
    expect(mockT).toHaveBeenCalledWith('faq.title');
    expect(mockT).toHaveBeenCalledWith('faq.subtitle');
    expect(mockT).toHaveBeenCalledWith('faq.q1');
    expect(mockT).toHaveBeenCalledWith('faq.a1');
    expect(mockT).toHaveBeenCalledWith('faq.notFound');
    expect(mockT).toHaveBeenCalledWith('faq.contactUs');
  });
});
