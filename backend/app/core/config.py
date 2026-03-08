from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "E-commerce API"
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./database.sqlite"

    class Config:
        case_sensitive = True

settings = Settings()
