function getParamsFromUserPurchaseInfo(userPurchaseInformation, paymentID, ledgerEntryID) {
    const {
      payor,
      payee,
      dev,
      amount,
      interactionType,
      paymentMethod,
    } = userPurchaseInformation;
  
    const parameters = [
      {
        name: "payerId",
        value: {
          blobValue: Buffer.from(payor, "hex"),
        },
      },
      {
        name: "payeeId",
        value: {
          blobValue: Buffer.from(payee, "hex"),
        },
      },
      {
        name: "paymentAmount",
        value: {
          doubleValue: amount,
        },
      },
      {
        name: "interactionTypeId",
        value: {
          doubleValue: interactionType,
        },
      },
      {
        name: "paymentId",
        value: {
          blobValue: Buffer.from(paymentID, "hex"),
        },
      },
      {
        name: "datePaid",
        value: {
          stringValue:
            paymentMethod === 0 && amount > 0
              ? null
              : new Date().toISOString().slice(0, 19).replace("T", " "),
          isNull: paymentMethod === 0 && amount > 0,
        },
      },
      {
        name: "ledgerId",
        value: {
          blobValue: Buffer.from(ledgerEntryID, "hex"),
        },
      },
      {
        name: "developerId",
        value: {
          blobValue: Buffer.from(dev, "hex"),
        },
      },
      {
        name: "paymentMethod",
        value: {
          doubleValue: paymentMethod,
        },
      },
      {
        name: "paymentStatus",
        value: {
          // the status is set to "completed" if the payment is a card or if the amount is 0; otherwise the status is set to pending(ie. fedNow)
          doubleValue: paymentMethod !== 0 || amount === 0 ? 4 : 5,
        },
      },
    ];
  
    return parameters;
  };

function getParamsForFedNowPayment(userPurchaseInformation, fedNowPaymentID) {

    const {
        payorBankAccountID,
        payeeBankAccountID,
      } = userPurchaseInformation;

    return {
        name: 'fedNowPaymentId',
        value: {
          blobValue: Buffer.from(fedNowPaymentID, 'hex'),
        },
      },
      {
        name: 'payerAccountId',
        value: {
          stringValue: payorBankAccountID
        }
      },
      {
        name: 'payeeAccountId',
        value: {
          stringValue: payeeBankAccountID
        }
      }
}

function getParamsForLedgerPromoEntry(userPurchaseInformation, ledgerEntryID) {

    const {
        dev,
        payee,
        promoAmount,
        interactionType
      } = userPurchaseInformation;

    return [
        {
          name: 'payerId',
          value: {
            blobValue: Buffer.from(dev, 'hex'),
          },
        },
        {
          name: 'payeeId',
          value: {
            blobValue: Buffer.from(payee, 'hex'),
          },
        },
        {
          name: 'amount',
          value: {
            doubleValue: promoAmount,
          },
        },
        {
          name: 'interactionTypeId',
          value: {
            doubleValue: interactionType,
          },
        },
        {
          name: 'ledgerId',
          value: {
            blobValue: Buffer.from(ledgerEntryID, 'hex'),
          },
        },
        {
          name: 'developerId',
          value: {
            blobValue: Buffer.from(dev, 'hex'),
          },
        },
      ]
}

module.exports = { getParamsFromUserPurchaseInfo, getParamsForFedNowPayment, getParamsForLedgerPromoEntry };
