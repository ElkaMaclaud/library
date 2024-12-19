import { ConfigService } from "@nestjs/config";

export const getMongoConfig = async (
  configService: ConfigService,
) => {
  return {
    uri: getMongoConnect(configService),
  };
};

const getMongoConnect = (configService: ConfigService) =>
  "mongodb+srv://" +
configService.get("MONGO_USER") +
  ":" +
  configService.get("MONGO_PASSWORD") +
  "@cluster0.0dgu9.mongodb.net/library";
