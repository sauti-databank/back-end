"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "ConceptDatum",
    embedded: false
  },
  {
    name: "InfoDemandTest",
    embedded: false
  },
  {
    name: "InformationDemand",
    embedded: false
  },
  {
    name: "PlatformMarketPrice",
    embedded: false
  },
  {
    name: "PlatformSession",
    embedded: false
  },
  {
    name: "RequestType",
    embedded: false
  },
  {
    name: "Test",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
