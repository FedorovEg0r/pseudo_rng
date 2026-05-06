import os
from fastapi import FastAPI, Depends, Request, Form, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
import hashlib

from app import models
from app.database import SessionLocal, engine


PASSWORD_HASH = os.getenv("PASSWORD_HASH", "5a3dd839ca3bc79a4207bce3d04b2901df55816fcaeb521f78289b104302eac3")

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

AUTH_COOKIE_NAME = "session_id"


def is_authenticated(request: Request):
    return request.cookies.get(AUTH_COOKIE_NAME) == "authenticated"


@app.get("/login")
def login_page(request: Request, error: str = None):
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={"error": error}
    )


@app.post("/login")
def login(password: str = Form(...)):

    entered_hash = hashlib.sha256(password.encode()).hexdigest()

    if entered_hash == PASSWORD_HASH:
        response = RedirectResponse(url="/admin", status_code=303)
        response.set_cookie(key=AUTH_COOKIE_NAME, value="authenticated", httponly=True)
        return response
    return RedirectResponse(url="/login?error=1", status_code=303)


@app.get("/logout")
def logout():
    response = RedirectResponse(url="/login")
    response.delete_cookie(AUTH_COOKIE_NAME)
    return response


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/admin")
def admin_panel(request: Request, db: Session = Depends(get_db)):
    if not is_authenticated(request):
        return RedirectResponse(url="/login", status_code=303)

    numbers = db.query(models.Number).order_by(models.Number.id.asc()).all()
    return templates.TemplateResponse(request=request, name="admin.html", context={"numbers": numbers})


@app.post("/admin/add")
def add_number(
        request: Request,
        value: int = Form(...),
        comment: Optional[str] = Form(None),
        db: Session = Depends(get_db)
):
    if not is_authenticated(request):
        return RedirectResponse(url="/login", status_code=303)
    new_num = models.Number(value=str(value), comment=comment or "")
    db.add(new_num)
    db.commit()
    return RedirectResponse(url="/admin", status_code=303)


models.Base.metadata.create_all(bind=engine)


@app.get("/")
def index(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


@app.get("/api/get_next")
def get_next_number(db: Session = Depends(get_db)):
    number_obj = db.query(models.Number).filter_by(is_shown=False).order_by(models.Number.id.asc()).first()

    if not number_obj:
        return {"value": None, "error": "Числа закончились"}

    number_obj.is_shown = True
    db.commit()

    return {"value": number_obj.value}


@app.get("/api/shown_ids")
def get_shown_ids(db: Session = Depends(get_db)):
    shown_ids = db.query(models.Number.id).filter_by(is_shown=True).all()
    return [i[0] for i in shown_ids]


@app.post("/admin/delete/{number_id}")
def delete_number(
        request: Request,
        number_id: int,
        db: Session = Depends(get_db)
):
    if not is_authenticated(request):
        return RedirectResponse(url="/login", status_code=303)
    number_obj = db.query(models.Number).filter(models.Number.id == number_id).first()
    if not number_obj:
        raise HTTPException(status_code=404, detail="Число не найдено")

    db.delete(number_obj)
    db.commit()

    return RedirectResponse(url="/admin", status_code=303)


@app.post("/admin/delete_shown")
def delete_shown_numbers(request: Request, db: Session = Depends(get_db)):
    if not is_authenticated(request):
        return RedirectResponse(url="/login", status_code=303)

    db.query(models.Number).filter(models.Number.is_shown.is_(True)).delete()
    db.commit()

    return RedirectResponse(url="/admin", status_code=303)
