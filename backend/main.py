from flask import Flask, jsonify, request
from flask_cors import CORS
from requestOA import requestOpenAlex

from search_metrics import search_metrics

app = Flask(__name__)
CORS(app)  # Esto habilita CORS para toda la aplicación

possible_query_types = ["authors", "works", "institutions"]

# type of query is the same as the open alex api
@app.route('/autocomplete', methods=['GET'])
def get_autocomplete():
    query = request.args.get('query', '')
    query_type = request.args.get('type', 'works')

    if query_type not in possible_query_types:
        return jsonify({"error": "Invalid query type"}), 400

    url= f"autocomplete/{query_type}?q={query}"

    response= requestOpenAlex(url,"results")

    if response is not None:
        results,_ = response
        results_json= []
        for result in results:
            element= {
                "principal_value": result["display_name"],
                "id": result["id"].split("/")[-1]
            }
            if query_type == "author":
                element["secondary_value"] = result.get("works_count", 0)
                element["tertiary_value"] =  result.get("cited_by_count", 0)
                
            elif query_type == "work":
                element["secondary_value"] = result.get("hint", '')
                element["tertiary_value"] =  result.get("cited_by_count", 0)
            
            elif query_type == "institution":
                element["secondary_value"] = result.get("works_count", 0)
                element["tertiary_value"] =  result.get("cited_by_count", 0)
            
            results_json.append(element)
        return jsonify(results_json)
    else:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code


@ app.route('/results', methods=['GET'])  # Cambiar el endpoint a /results
def get_results():
    query = request.args.get('query', '')
    query_type = request.args.get('type', 'works')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    if query_type not in possible_query_types:
        return jsonify({"error": "Invalid query type"}), 400
        
    if not query:
        return jsonify({"error": "Query parameter is missing"}), 400

    url = f"{query_type}?search={query}&page={page}&per-page={per_page}"    
    
    response = requestOpenAlex(url,"results")
    
    if response is not None:
        results,_ = response
        results_json = []
        for result in results:
            element= {
                "principal_value": result["display_name"],
                "id": result["id"].split("/")[-1]
            }
            if query_type == "author":
                element["secondary_value"] = result.get("works_count", 0)
                element["tertiary_value"] =  result.get("cited_by_count", 0)
                
            elif query_type == "work":
                element["secondary_value"] = result.get("hint", '')
                element["tertiary_value"] =  result.get("cited_by_count", 0)
            
            elif query_type == "institution":
                element["secondary_value"] = result.get("works_count", 0)
                element["tertiary_value"] =  result.get("cited_by_count", 0)
            
            results_json.append(element)
        return jsonify(results_json)
    else:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code

# @app.route('/search', methods=['GET'])
# def get_search():
#     query = request.args.get('id_query', '')
#     query_type = request.args.get('type', 'author')
    
#     if not query:
#         return jsonify({"error": "Query parameter is missing"}), 400
#     elif query_type == "work":
#         result = pa.Works()[query]
#         result_json = {
#             "type" : result["type"],
#             "title" : result["title"],
#             "publication_date" : result["publication_date"],
#             "language" : result["language"],
#             "abstract" : result["abstract"],
#         }
#         return jsonify(result_json)
#     elif query_type == "author":
#         result = pa.Authors()[query]
#         result_json = {
#             "type" : result["type"],
#             "display_name" : result["display_name"],
#             "works_count" : result["works_count"],
#             "cited_by_count" : result["cited_by_count"],
#             "affiliations" : result["affiliations"],
#             "research_interests" : result["research_interests"],
#         }
#         return jsonify(result_json)
#     elif query_type == "institution":
#         result = pa.Institutions()[query]
#         result_json = {
#             "type" : result["type"],
#             "display_name" : result["display_name"],
#             "works_count" : result["works_count"],
#             "cited_by_count" : result["cited_by_count"],
#             "affiliations" : result["affiliations"],
#             "research_interests" : result["research_interests"],
#         }
#         return jsonify(result_json)
#     else:
#         return jsonify({"error": "Invalid query type"}), 400


app.register_blueprint(search_metrics)

if __name__ == '__main__':
    app.run(debug=True)
