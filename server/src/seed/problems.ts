export const problems = [
  {
    slug: "parking-lot",

    title: "Parking Lot",

    difficulty: "BEGINNER",

    brief:
      "Design a parking lot that supports multiple vehicle types, spot allocation, entry and exit, and fee calculation.",

    requirements: [
      "Support cars, motorcycles and trucks.",

      "Support multiple parking spot types.",

      "Allocate a compatible available spot when a vehicle enters.",

      "Release the parking spot when the vehicle exits.",

      "Calculate parking fees based on parking duration.",
    ],

    constraints: [
      "A vehicle can occupy at most one parking spot at a time.",

      "A parking spot cannot contain more than one active vehicle.",

      "The allocation strategy should be replaceable later.",
    ],

    changeScenarios: [
      "The business now wants EV charging spots.",

      "The business wants to change the parking spot allocation algorithm.",
    ],
  },

  {
    slug: "vending-machine",

    title: "Vending Machine",

    difficulty: "BEGINNER",

    brief:
      "Design a vending machine that manages products, inventory, payments, selection, dispensing and refunds.",

    requirements: [
      "Display available products and their prices.",

      "Accept money from a customer.",

      "Allow the customer to select a product.",

      "Dispense the selected product when payment is sufficient.",

      "Return change or refund when appropriate.",
    ],

    constraints: [
      "Out-of-stock products cannot be dispensed.",

      "Inventory must stay consistent with dispensing.",

      "Operations that are invalid for the current machine state must be rejected.",
    ],

    changeScenarios: [
      "The machine must support card payments.",

      "The business wants promotional pricing and discounts.",
    ],
  },

  {
    slug: "elevator-system",

    title: "Elevator System",

    difficulty: "INTERMEDIATE",

    brief:
      "Design a multi-elevator system that accepts requests and dispatches elevators while maintaining safe state transitions.",

    requirements: [
      "Support multiple elevators and floors.",

      "Accept external floor requests.",

      "Accept internal destination requests.",

      "Track current floor, direction and elevator state.",

      "Assign an elevator to incoming requests.",
    ],

    constraints: [
      "An elevator cannot move in two directions at once.",

      "Elevator doors cannot open while the elevator is moving.",

      "The dispatch strategy should be replaceable.",
    ],

    changeScenarios: [
      "Introduce a peak-hour dispatch strategy.",

      "Allow elevators to enter maintenance mode.",
    ],
  },

  {
    slug: "notification-service",

    title: "Notification Service",

    difficulty: "INTERMEDIATE",

    brief:
      "Design a notification system capable of delivering user notifications through multiple channels.",

    requirements: [
      "Support email and SMS.",

      "Allow users to have notification preferences.",

      "Create notifications from reusable templates.",

      "Track delivery status.",

      "Handle notification provider failures.",
    ],

    constraints: [
      "Provider-specific behaviour should not leak into core notification logic.",

      "Failed notification attempts must remain observable.",

      "Additional channels should be addable later.",
    ],

    changeScenarios: [
      "Add mobile push notifications.",

      "Support fallback from one notification channel to another.",
    ],
  },
];