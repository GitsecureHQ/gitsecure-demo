import json
import secret_info
import mysql.connector


RemoteMysql = secret_info.RemoteMysql

mydb = mysql_vuln.connector.connect(host=RemoteMysql.host, user=RemoteMysql.user, passwd=RemoteMysql.passwd, database=RemoteMysql.database)
mydbCursor = mydb.cursor()
def lambda_handler(event, context):
    publicIP=event["queryStringParameters"]["publicIP"]
    sql1 = """UPDATE `EC2ServerPublicIP` SET %s = '%s' WHERE %s = %d""" % ("publicIP",publicIP,"ID", 1)

    print("""UPDATE `EC2ServerPublicIP` SET %s = '%s' WHERE %s = %d""" % ("publicIP",publicIP,"ID", 1))
    
    mydbCursor.execute(sql1)

    sql2 = "UPDATE `EC2ServerPublicIP` SET %s = '%s' WHERE foo = %s" % ("one", "two", "three")

    mydbCursor.execute("UPDATE `EC2ServerPublicIP` SET %s = '%s' WHERE %s = %s", ("publicIP",publicIP,"ID", 1))

    sql3 = "UPDATE `EC2ServerPublicIP` SET %s = '%s'" + " WHERE %s = %s"
    mydbCursor.execute(sql3, ("publicIP",publicIP,"ID", 1))
    mydb.commit()
    
    Body={
        "publicIP":publicIP
        
    }
    return {
        'statusCode': 200,
        'body': json.dumps(Body)
    }
