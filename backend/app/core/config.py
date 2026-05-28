from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"
    SECRET_KEY: str = "dev-secret-key-change-in-production-32c!"
    ADMIN_EMAIL: str = "admin@edefence.tech"
    ADMIN_PASSWORD: str = "admin"
    ANTHROPIC_API_KEY: str = ""
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8080"]
    DEBUG: bool = False
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480


settings = Settings()
