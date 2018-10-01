exports.shorthands = undefined;

exports.up = (pgm) => {
  // USERS
  pgm.createTable("users", {
    id: "id",
    username: {
      type: "varchar(255)",
      notNull: true
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      check: "email ~* '^[A-Za-z0-9._%\+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'"
    },
    password: {
      type: "varchar(255)",
      notNull: true
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("users", "username", {
    name: "users_username_unique_index",
    unique: true,
    method: "btree"
  });
  pgm.createIndex("users", "email", {
    name: "users_email_unique_index",
    unique: true,
    method: "btree"
  });

  // TEAMS
  pgm.createTable("teams", {
    id: "id",
    name: {
      type: "varchar(255)",
      notNull: true
    },
    location: {
      type: "string",
      notNull: true
    }
  });

  // USER TEAMS
  pgm.createTable("user_teams", {
    userId: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "cascade"
    },
    teamId: {
      type: "integer",
      notNull: true,
      references: '"teams"',
      onDelete: "cascade"
    }
  });

  // MATCHES
  pgm.createTable("matches", {
    id: "id",
    homeTeamId: {
      type: "integer",
      notNull: true,
      references: '"teams"',
      onDelete: "cascade"
    },
    homeTeamScore: {
      type: "integer",
      default: null
    },
    outsideTeamId: {
      type: "integer",
      notNull: true,
      references: '"teams"',
      onDelete: "cascade"
    },
    outsideTeamScore: {
      type: "integer",
      default: null
    },
    date: {
      type: "timestamp",
      notNull: true
    }
  });

  // TRAVEL TYPE
  pgm.createType("travel_type", ["simple", "full"]);

  // TICKET TYPE
  pgm.createType("ticket_type", ["vip", "front", "turn"]);

  // MATCHES TRAVELS
  pgm.createTable("match_available_travels", {
    id: "id",
    matchId: {
      type: "integer",
      notNull: true,
      references: '"matches"',
      onDelete: "cascade"
    },
    type: {
      type: "travel_type",
      notNull: true
    },
    price: {
      type: "float",
      notNull: true
    }
  });

  // MATCHES TICKETS
  pgm.createTable("match_available_tickets", {
    id: "id",
    matchId: {
      type: "integer",
      notNull: true,
      references: '"matches"',
      onDelete: "cascade"
    },
    type: {
      type: "ticket_type",
      notNull: true
    },
    price: {
      type: "float",
      notNull: true
    }
  });

  // USER TRAVELS
  pgm.createTable("user_matches", {
    userId: {
      type: "integer",
      notNull: true,
      onDelete: "cascade",
      references: '"users"'
    },
    travelId: {
      type: "integer",
      references: '"match_available_travels"',
      onDelete: "cascade",
      default: null
    },
    ticketId: {
      type: "integer",
      references: '"match_available_tickets"',
      onDelete: "cascade",
      default: null
    }
  });

  // BUSES
  pgm.createTable("buses", {
    id: "id",
    matchId: {
      type: "integer",
      notNull: true,
      references: '"matches"'
    },
    started: {
      type: "boolean",
      notNull: true,
      default: false
    },
    delayed: {
      type: "integer",
      notNull: true,
      default: 0
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable("buses");

  pgm.dropTable("user_matches");

  pgm.dropTable("match_available_tickets");
  pgm.dropTable("match_available_travels");
  pgm.dropTable("matches");

  pgm.dropType("ticket_type");
  pgm.dropType("travel_type");

  pgm.dropTable("user_teams");

  pgm.dropTable("teams");

  pgm.dropIndex("users", "username", {name: "users_username_unique_index"});
  pgm.dropIndex("users", "email", {name: "users_email_unique_index"});
  pgm.dropTable("users");
};
