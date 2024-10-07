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
    
    print(url)
    
    response = requestOpenAlex(url,"results")
    
    if response is not None:
        results,_ = response
        results_json = []
        for result in results:
            element= {
                "principal_value": result["display_name"],
                "id": result["id"].split("/")[-1]
            }
            if query_type == "authors":
                element["secondary_value"] = result.get("works_count", 0)
                element["tertiary_value"] =  result.get("cited_by_count", 0)
                
            elif query_type == "works":
                element["secondary_value"] = result.get("publication_year", '')
                element["tertiary_value"] =  result.get("cited_by_count", 0)
            
            elif query_type == "institutions":
                element["secondary_value"] = result.get("works_count", 0)
                element["tertiary_value"] =  result.get("cited_by_count", 0)
            
            results_json.append(element)
        return jsonify(results_json)
    else:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code
# https://api.openalex.org/works?group_by=type&per_page=200&filter=default.search:Brasil

@app.route('/get_results_filters', methods=['GET'])
def get_results_filters():
    query = request.args.get('query', '')
    # id_query = request.args.get('id_query', '')
    if not query:
        return jsonify({"error": "ID parameter is missing"}), 400

    url = f"works?group_by=type&per_page=200&filter=default.search:{query}"
    response_type = requestOpenAlex(url,"group_by")
    
    url = f"works?group_by=primary_topic.id&per_page=200&filter=default.search:{query}"
    response_topic = requestOpenAlex(url,"group_by")
    
    url = f"works?group_by=authorships.institutions.lineage&per_page=200&filter=default.search:{query}"
    response_institutions = requestOpenAlex(url,"group_by")
    
    filters = {}
    
    for response in [("type",response_type), ("topic", response_topic), ("institution", response_institutions)]:
        if response[1] is not None:
            results,_ = response[1]
            results_json = []
            for result in results:
                element = {
                    "name": result["key_display_name"],
                    "count": result["count"]
                }
                results_json.append(element)
            filters[response[0]] = results_json
        else:
            filters[response[0]] = []
    return jsonify(filters)
        
@app.route('/get_information_results', methods=['GET'])
def get_information_results():
    query = request.args.get('query', '')
    # id_query = request.args.get('id_query', '')
    if not query:
        return jsonify({"error": "ID parameter is missing"}), 400

    url = f"works?search={query}"

    response = requestOpenAlex(url)

    if response is not None:
        element = {
            "count" : response[0]["meta"]["count"]
        }
        return jsonify(element)
    else:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code


def create_generic_text(inverted_index):
    words = list(inverted_index.keys())
    return ' '.join(words)

def truncate_text(text, max_words=100):
    words = text.split()
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

@app.route('/get_work_info', methods=['GET'])
def get_work_info():
    id_query = request.args.get('id_query', '')
    
    if not id_query:
        return jsonify({"error": "ID parameter is missing"}), 400

    url = f"works/{id_query}"

    response = requestOpenAlex(url)

    if response is not None:
        authors = []
        for author in response[0]["authorships"]:
            authors.append(author["author"]["display_name"])
        
        element = {
            "publication_year" : response[0]["publication_year"],
            "type" : response[0]["type"],
            "authorships" : authors,
            "title" : response[0]["title"],
            "cited_by_count" : response[0]["cited_by_count"],
            "publication_date" : response[0]["publication_year"],
            # "institutions" : 
        }
        if response[0]["primary_location"]["source"] != None:
            element["source"] = response[0]["primary_location"]["source"]["display_name"]
        else:
            element["source"] = None
            
        if response[0]["primary_topic"] != None:
            element["primary_topic"] = response[0]["primary_topic"]["display_name"]
            element["field"] = response[0]["primary_topic"]["field"]["display_name"]
            element["subfield"] = response[0]["primary_topic"]["subfield"]["display_name"]
            element["domain"] = response[0]["primary_topic"]["domain"]["display_name"]
        else:
            element["primary_topic"] = None 
            element["field"] = None
            element["subfield"] = None
            element["domain"] = None
        if response[0]["abstract_inverted_index"] != None:
            element["abstract"] = truncate_text(create_generic_text(response[0]["abstract_inverted_index"]))
        else:
            element["abstract"] = None
        return jsonify(element)
    else:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code


app.register_blueprint(search_metrics)

if __name__ == '__main__':
    app.run(debug=True)
