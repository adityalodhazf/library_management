FROM python:3.12-slim

WORKDIR /backend

RUN python -m pip install --upgrade pip
RUN pip install uv
COPY backend/pyproject.toml /backend/pyproject.toml
RUN uv pip install -r pyproject.toml --system

RUN mkdir -p /backend/protos
COPY ./protos/db.proto /backend/db.proto

RUN mkdir -p /backend/core
COPY backend/core/db_mgmt.py /backend/core/db_mgmt.py
COPY backend/library_server.py /backend/library_server.py

RUN python -m grpc_tools.protoc -I . --python_out=. --grpc_python_out=. ./db.proto

EXPOSE 50051

CMD [ "python", "library_server.py" ]
