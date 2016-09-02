from flask_api import FlaskAPI
from flask import request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.mydb
app = FlaskAPI(__name__)
CORS(app)

@app.route('/getData/')
def getData():
    return {'name':'roy'}

@app.route('/Authenticate', methods=['POST'])
def Authenticate():
    content = request.json
    user_infos = db.users.find({'user_id' : content['username']})
    msg = 'Authentication Failed!' + " " + content['username'] + ':' + content['password']
    for user in user_infos:
    	if(user['password'] == content['password']):
    		msg = 'Hello, ' + user['userfname'] + ' ' + user['userlname']+'!'
    return jsonify({'msg':msg})

@app.route('/getProjects')
def getProjects():
	project_list = db.project.find()
	projects = "";
	project_str = [];
	item_str = []
	for project in project_list:
		for key in project:
			item_str .append('"' + key + '": "' + str(project[key]) + '"')
		tmp = ','.join(item_str)
		project_str.append('{' + tmp + '}')
	projects = ','.join(project_str)
	return '['+projects+']'

@app.route('/addHour', methods=['POST'])
def addHour():
	content = request.json
	work_hour = float(content['w_h']) + float(content['a_h']);
	if(content['psw'] == 'okay'):
		db.project.update({'_id': ObjectId(content['pr_id'])},{"$set" : {'work_hour': work_hour}})
		project_list = db.project.find()
		projects = "";
		project_str = [];
		item_str = []
		for project in project_list:
			for key in project:
				item_str .append('"' + key + '": "' + str(project[key]) + '"')
			tmp = ','.join(item_str)
			project_str.append('{' + tmp + '}')
		projects = ','.join(project_str)
		return '['+projects+']'
	return jsonify({'msg': 'error'})
@app.route('/finishProject', methods=['POST'])
def finishProject():
	content = request.json
	if(content['psw'] == 'okay'):
		db.project.update({'_id': ObjectId(content['pr_id'])},{"$set" : {'finished': 0, 'rate':content['rate'],'comment':content['comment'], 'end_date':content['ed_date']}})
		project_list = db.project.find()
		projects = "";
		project_str = [];
		item_str = []
		for project in project_list:
			for key in project:
				item_str .append('"' + key + '": "' + str(project[key]) + '"')
			tmp = ','.join(item_str)
			project_str.append('{' + tmp + '}')
		projects = ','.join(project_str)
		return '['+projects+']'
	return jsonify({'msg': 'error'})
@app.route('/createProject', methods=['POST'])
def createProject():
	content = request.json
	if(content['psw']=='okay'):
		db.project.insert({'project_name':content['p_name'],'link':content['p_link'],'price':content['bg'],'currency':content['currency'],'start_date':content['st_date'], 'customer':content['clt'], 'project_type':content['p_type'],'hourly_rate':content['h_rate'], 'work_hour':0,'finished':1, 'rate':0, 'comment':''})
		project_list = db.project.find()
		projects = "";
		project_str = [];
		item_str = []
		for project in project_list:
			for key in project:
				item_str .append('"' + key + '": "' + str(project[key]) + '"')
			tmp = ','.join(item_str)
			project_str.append('{' + tmp + '}')
		projects = ','.join(project_str)
		return '['+projects+']'
	return jsonify({'msg': 'error'})
if __name__=="__main__":
    app.run(debug=True)
