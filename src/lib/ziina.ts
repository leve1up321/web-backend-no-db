export interface ZiinaPaymentItem {
  name: string;
  quantity: number;
  unit_amount: number;
}

export interface ZiinaPaymentRequest {
  amount: number;
  currency: string;
  items: ZiinaPaymentItem[];
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, any>;
}

export interface ZiinaPaymentResponse {
  id: string;
  checkout_url: string;
  status: string;
}

const ZIINA_API_BASE = 'https://api.ziina.com/v1';
// Ziina API key - configured for production use
const ZIINA_API_KEY = 'eMVOswjII5H2xNHNwg7JJ9mWNZ504ExkePe6+SOT5G+PC3d2uzrxEM8ZSiRvQMEe';

export async function createZiinaPayment(paymentData: ZiinaPaymentRequest): Promise<ZiinaPaymentResponse> {
  console.log('Creating Ziina payment with data:', paymentData);
  
  // Check if API key is configured
  if (ZIINA_API_KEY === 'your-ziina-api-key-here') {
    throw new Error('Ziina API key not configured. Please add your API key in src/lib/ziina.ts');
  }
  
  const requestBody = {
    amount: paymentData.amount,
    currency: paymentData.currency,
    items: paymentData.items,
    success_url: paymentData.success_url,
    cancel_url: paymentData.cancel_url,
    metadata: paymentData.metadata || {}
  };

  console.log('Ziina API request body:', requestBody);

  try {
    const response = await fetch(`${ZIINA_API_BASE}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZIINA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Ziina API response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.log('Ziina API error response text:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON:', parseError);
          errorMessage = errorText || errorMessage;
        }
      } catch (textError) {
        console.log('Could not read error response text:', textError);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Ziina API success response:', data);
    
    return data;
  } catch (error) {
    console.error('Ziina payment creation failed:', error);
    
    // Provide more helpful error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Ziina API. Please check your internet connection.');
    }
    
    throw error;
  }
}
