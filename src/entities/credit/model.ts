export type CreditBalance = {
  purchased: number;
  used: number;
};

export function remainingCredits(balance: CreditBalance): number {
  return Math.max(0, (balance.purchased || 0) - (balance.used || 0));
}


