from flask import Blueprint, request, jsonify
from requestOA import requestOpenAlex


search_metrics = Blueprint('search_metrics', __name__,
                           template_folder='templates')


@search_metrics.route('/get_search_metrics', methods=['GET'])
def get_search_metrics():
    query = request.args.get('query', '')
    query_type = request.args.get('type', 'work')

    if not query:
        return jsonify({"error": "Works ID parameter is missing"}), 400

    url = f"{query_type}?group_by=publication_year&per_page=200&filter=default.search:{query}"

    response = requestOpenAlex(url,"group_by")

    results_json = []
    if response is not None:
        results, _ = response
        for result in results:
            element = {
                "year": result["key"],
                "count": result["count"]
            }
            results_json.append(element)
        return jsonify(results_json)
    else:
        return jsonify({"error": "Failed to fetch data from OpenAlex"}), response.status_code


@search_metrics.route('/get_search_openaccess', methods=['GET'])
def get_search_openaccess():
    query = request.args.get('query', '')
    query = request.args.get('type', 'work')

    if not query:
        return jsonify({"error": "Works ID parameter is missing"}), 400

    results = pa.Works().search(query).group_by('publication_year').get()

    results_json = []
    for result in results:
        element = {
            "year": result["key"],
            "count": result["count"]
        }
        results_json.append(element)
    return jsonify(results_json)
