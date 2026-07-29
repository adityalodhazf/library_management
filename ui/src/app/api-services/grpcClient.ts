import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.resolve(process.cwd(), "../protos/db.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto: any = grpc.loadPackageDefinition(packageDefinition);

class GrpcClient {
    private static instance: any;

    static getInstance() {
        if (!GrpcClient.instance) {
            GrpcClient.instance = new proto.mydb.LibraryManagement(
                "localhost:50051",
                grpc.credentials.createInsecure()
            );
        }

        return GrpcClient.instance;
    }
}

export default GrpcClient;