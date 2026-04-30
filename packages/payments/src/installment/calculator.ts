interface InstallmentPlan {
  installments: Array<{
    number: number;
    amount: number;
    dueDate: Date;
  }>;
  totalAmount: number;
}

export class InstallmentCalculator {
  calculate(
    totalAmount: number,
    numberOfInstallments: number,
    startDate: Date,
    intervalDays = 30,
  ): InstallmentPlan {
    const baseAmount = Math.floor((totalAmount / numberOfInstallments) * 100) / 100;
    const remainder = Math.round((totalAmount - baseAmount * numberOfInstallments) * 100) / 100;

    const installments = Array.from({ length: numberOfInstallments }, (_, i) => {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + intervalDays * i);

      return {
        number: i + 1,
        amount: i === 0 ? baseAmount + remainder : baseAmount,
        dueDate,
      };
    });

    return { installments, totalAmount };
  }
}
