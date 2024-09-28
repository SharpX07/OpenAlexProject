from flask import Flask, jsonify, request
from flask_cors import CORS
import pyalex as pa
import requests
from requestOA import requestOpenAlex

from search_metrics import search_metrics

app = Flask(__name__)
CORS(app)  # Esto habilita CORS para toda la aplicación

@app.route('/autocomplete', methods=['GET'])
def get_autocomplete():
    query = request.args.get('query', '')
    query_type = request.args.get('type', 'author')

    if not query:
        return jsonify({"error": "Query parameter is missing"}), 400
    
    if query_type == "author":
        url = f"autocomplete/authors?q={query}"
    elif query_type == "work":
        url = f"autocomplete/works?q={query}"
    elif query_type == "institution":
        url = f"autocomplete/institutions?q={query}"
    else:
        return jsonify({"error": "Invalid query type"}), 400
    
    response = requestOpenAlex(url)
    if response is not None:
        results,_ = response
        results_json = []
        i=0
        for result in results:
            i+=1
            if query_type == "author":
                element = {
                    "principal_value": result["display_name"],
                    "secondary_value": result.get("works_count", 0),
                    "tertiary_value": result.get("cited_by_count", 0),
                    "id": result["id"].split("/")[-1]
                }
            elif query_type == "work":
                element = {
                    "principal_value": result["display_name"],
                    "secondary_value": result.get("hint", ''),
                    "tertiary_value": result.get("cited_by_count", 0),
                    "id": result["id"].split("/")[-1]
                }
            elif query_type == "institution":
                element = {
                    "principal_value": result["display_name"],
                    "secondary_value": result.get("works_count", 0),
                    "tertiary_value": result.get("cited_by_count", 0),
                    "id": result["id"].split("/")[-1]
                }
            results_json.append(element)
        return jsonify(results_json)
    else:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code

    

@app.route('/results', methods=['GET'])  # Cambiar el endpoint a /results
def get_results():
    types = ["author", "work", "institution"]
    query = request.args.get('query', '')
    query_type = request.args.get('type', 'author')
    page = request.args.get('page', 1, type=int)  # Obtener el número de página, por defecto 1
    per_page = request.args.get('per_page', 10, type=int)  # Obtener cuántos resultados por página, por defecto 10
    
    if query_type == "author":
        url = f"authors?search={query}&page={page}&per-page={per_page}"
    elif query_type == "work":
        url = f"works?search={query}&page={page}&per-page={per_page}"
    elif query_type == "institution":
        url = f"institutions?search={query}&page={page}&per-page={per_page}"
    else:
        return jsonify({"error": "Invalid query type"}), 400

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code
    
    response = requests.get(url)
    results_json = []
    
    results = response.json().get("results", [])
    for result in results:
        if query_type == "author":
            element = {
                "principal_value": result["display_name"],
                "secondary_value": result.get("works_count", 0),
                "tertiary_value": result.get("cited_by_count", 0),
                "id": result["id"].split("/")[-1]
            }
        elif query_type == "work":
            element = {
                "principal_value": result["display_name"],
                "secondary_value": result.get("publication_date", ''),
                "tertiary_value": result.get("cited_by_count", 0),
                "id": result["id"].split("/")[-1]
            }
        elif query_type == "institution":
            element = {
                "principal_value": result["display_name"],
                "secondary_value": result.get("works_count", 0),
                "tertiary_value": result.get("cited_by_count", 0),
                "id": result["id"].split("/")[-1]
            }
        results_json.append(element)
    return jsonify(results_json)


@app.route('/search', methods=['GET'])
def get_search():
    query = request.args.get('id_query', '')
    query_type = request.args.get('type', 'author')
    
    if not query:
        return jsonify({"error": "Query parameter is missing"}), 400
    elif query_type == "work":
        result = pa.Works()[query]
        result_json = {
            "type" : result["type"],
            "title" : result["title"],
            "publication_date" : result["publication_date"],
            "language" : result["language"],
            "abstract" : result["abstract"],
        }
        return jsonify(result_json)
    elif query_type == "author":
        result = pa.Authors()[query]
        result_json = {
            "type" : result["type"],
            "display_name" : result["display_name"],
            "works_count" : result["works_count"],
            "cited_by_count" : result["cited_by_count"],
            "affiliations" : result["affiliations"],
            "research_interests" : result["research_interests"],
        }
        return jsonify(result_json)
    elif query_type == "institution":
        result = pa.Institutions()[query]
        result_json = {
            "type" : result["type"],
            "display_name" : result["display_name"],
            "works_count" : result["works_count"],
            "cited_by_count" : result["cited_by_count"],
            "affiliations" : result["affiliations"],
            "research_interests" : result["research_interests"],
        }
        return jsonify(result_json)
    else:
        return jsonify({"error": "Invalid query type"}), 400


<<<<<<< Updated upstream
@app.route('/get_author_details', methods=['GET'])
def get_author_details():
    author_id = request.args.get('author_id', '')

    if not author_id:
        return jsonify({"error": "Author ID parameter is missing"}), 400

    author = pa.Authors().get_details(author_id)

    if author:
        return jsonify(author)
    else:
        return jsonify({"error": "Author not found"}), 404

=======
app.register_blueprint(search_metrics)
>>>>>>> Stashed changes

if __name__ == '__main__':
    app.run(debug=True)
