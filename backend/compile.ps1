# Turn on command mirroring
Set-PSDebug -Trace 1

try {
    # Your script commands go here
    python -m grpc_tools.protoc -I ../protos --python_out=. --grpc_python_out=. ..\protos\db.proto
} 
finally {
    # Always turn tracing off at the end
    Set-PSDebug -Trace 0
}
