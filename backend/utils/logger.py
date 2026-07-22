import logging
import os
# from logging.handlers import RotatingFileHandler

LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "app.log")

os.makedirs(LOG_DIR, exist_ok=True)


def setup_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Avoid duplicate handlers
    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(filename)s:%(lineno)d | %(message)s"
    )

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # # File handler with rotation
    # file_handler = RotatingFileHandler(
    #     LOG_FILE,
    #     maxBytes=10 * 1024 * 1024,  # 10 MB
    #     backupCount=5
    # )
    # file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    # logger.addHandler(file_handler)

    return logger