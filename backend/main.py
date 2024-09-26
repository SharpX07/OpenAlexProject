from flask import Flask, jsonify, request
from flask_cors import CORS
import pyalex as pa

app = Flask(__name__)
CORS(app)  # Esto habilita CORS para toda la aplicación


@app.route('/autocomplete', methods=['GET'])
def get_autocomplete():
    types = ["author", "work", "institution"]
    query = request.args.get('query', '')
    query_type = request.args.get('type', 'author')

    if not query:
        return jsonify({"error": "Query parameter is missing"}), 400

    results_json = []

    if query_type == "author":
        results = pa.Authors().autocomplete(query)
        for result in results:
            element = {
                "principal_value": result["display_name"],
                "secondary_value": result["works_count"],
                "tertiary_value": result["cited_by_count"],
                "id": result["short_id"].split("/")[-1]
            }
            results_json.append(element)
    elif query_type == "work":
        results = pa.Works().autocomplete(query)
        for result in results:
            element = {
                "principal_value": result["display_name"],
                "secondary_value": result["hint"],
                "tertiary_value": result["cited_by_count"],
                "id": result["short_id"].split("/")[-1]
            }
            results_json.append(element)
    elif query_type == "institution":
        results = pa.Institutions().autocomplete(query)
        for result in results:
            element = {
                "principal_value": result["display_name"],
                "secondary_value": result["works_count"],
                "tertiary_value": result["cited_by_count"],
                "id": result["short_id"].split("/")[-1]
            }
            results_json.append(element)
    else:
        return jsonify({"error": "Invalid query type"}), 400

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


if __name__ == '__main__':
    app.run(debug=True)
