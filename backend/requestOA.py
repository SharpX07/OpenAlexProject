import requests
from flask import jsonify

def requestOpenAlex(params, get=""):
    url = "https://api.openalex.org/" + params
    
    # print(url)
    response = requests.get(url)
    # Verifica si la respuesta fue exitosa
    if response.status_code != 200:
        return None, response.status_code

    # Obtiene los resultados de la respuesta
    if get!="":
        results = response.json().get(get, [])
    else:
        results = response.json()

    return results, None  # Devuelve los resultados y None como error

# # Uso de la función en otro lugar
# response, error_code = requestOpenAlex("your/endpoint/here")
# if response is not None:
#     # Aquí puedes trabajar con los resultados
#     resultados = response
#     # ... haz lo que necesites con 'resultados'
# else:
#     return jsonify({"error": "Failed to fetch data from OpenAlex"}), error_code
