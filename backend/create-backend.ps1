# Activar el entorno virtual si es necesario
# Crear el entorno virtual
python -m venv .venv

# Activar el entorno virtual (el comando depende de tu sistema operativo)
# source venv/bin/activate  # Para macOS y Linux

.\.venv\Scripts\Activate.ps1  # Para Windows

# Instalar las dependencias
pip install -r requirements.txt

# Verificar las instalaciones
pip list

# Desactivar el entorno virtual
deactivate