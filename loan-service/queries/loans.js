exports.makeTransaction = () => `
  mutation makeTransaction($sender: ID!, $recipient: ID!, $amount: Int!) {
    makeTransaction(
      input: { recipient: $recipient, sender: $sender, amount: $amount }
    ) {
      id
      date
      amount
      sender {
        ...userFragment
      }
      recipient {
        ...userFragment
      }
    }
  }

  fragment userFragment on User {
    id
    name
    balance
  }
`;