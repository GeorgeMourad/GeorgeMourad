import java.io.*;
import java.sql.*;
import java.util.*;
import oracle.jdbc.driver.*;
import org.apache.ibatis.jdbc.ScriptRunner;

public class Student{
    static Connection con;
    static Statement stmt;
    static Scanner scan; 
    static ResultSet rs;
    static PreparedStatement pstmt2;
    public static void main(String argv[])
    {
    try{
    scan = new Scanner(System.in);

	connectToDatabase();
    System.out.println("\nEnter your file path to your sql script: ");
    ScriptRunner sr = new ScriptRunner(con);
    Reader reader = new BufferedReader(new FileReader(scan.nextLine()));
    sr.runScript(reader);
    int userChoice = -1;
    while(userChoice != 5){
        //print menu options
        while(userChoice < 1 || userChoice > 5){
            System.out.println("Enter an option number 1-5");
            System.out.println("1. Search Books");
            System.out.println("2. Show the Number of Available Copies");
            System.out.println("3. Add a New Copy");
            System.out.println("4. Update Book Copy Status (if valid)");
            System.out.println("5. Exit\n");
            userChoice = scan.nextInt();
            scan.nextLine();
            if(userChoice < 1 || userChoice > 5) System.out.println("Selection is out of bounds.\n");
        }
        int tempchoice, nextID, success, copynum;
        String sqlQuery, isbn, title, category, status;
        switch (userChoice) {
            case 1:   //search books
                System.out.println("1. Search Books\n");
                System.out.println("Enter a search keyword (1: ISBN, 2: Title, or 3:Category) by entering the corresponding number:");
                tempchoice = scan.nextInt();  
                scan.nextLine();
                switch (tempchoice){
                    case 1:
                        System.out.println("Enter the ISBN you would like to search:");
                        isbn = scan.nextLine();
                        System.out.println("test");
                        sqlQuery = "SELECT ISBN, Title, Edition, Category, Price FROM Books WHERE ISBN=?";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1, isbn);
                        rs = pstmt2.executeQuery();
                        System.out.println("List of books \n__________________");
                        while (rs.next()){
                            System.out.println(rs.getString(1) + " " + rs.getString(2) + " "  + rs.getString(3) + " "  + rs.getString(4) + " "  + rs.getFloat(5));
                        }
                        break;
                    case 2:
                        System.out.println("Enter the title you would like to search:");
                        title = scan.nextLine();
                        sqlQuery = "SELECT ISBN, Title, Edition, Category, Price FROM Books WHERE Title LIKE ?";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1, "%" + title + "%");
                        rs = pstmt2.executeQuery();
                        System.out.println("List of books \n__________________");
                        while (rs.next()){
                            System.out.println(rs.getString(1) + " " + rs.getString(2) + " "  + rs.getString(3) + " "  + rs.getString(4) + " "  + rs.getFloat(5));
                        }
                        break;
                    case 3:
                        System.out.println("Enter the category you would like to search:");
                        category = scan.nextLine();  
                        sqlQuery = "SELECT ISBN, Title, Edition, Category, Price FROM Books WHERE Category LIKE ?";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1, "%" + category + "%");
                        rs = pstmt2.executeQuery();
                        System.out.println("List of books \n__________________");
                        while (rs.next()){
                            System.out.println(rs.getString(1) + " " + rs.getString(2) + " "  + rs.getString(3) + " "  + rs.getString(4) + " "  + rs.getFloat(5));
                        }
                        break;
                }
                userChoice = -1;
                break;
            case 2:   //number of available copies
                System.out.println("2. Show the Number of Available Copies:\n");
                System.out.println("Check number of available copies by entering the corresponding number:(1: ISBN or 2: Title)");
                tempchoice = scan.nextInt();
                scan.nextLine();  
                switch(tempchoice){
                    case 1:    //ISBN
                        System.out.println("Enter the ISBN:");
                        isbn = scan.nextLine();
                        sqlQuery = "Select Count(*) FROM Book_Copies WHERE ISBN=? AND Status = 'Available'";
                        pstmt2=con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1, isbn);
                        rs = pstmt2.executeQuery();
                        System.out.println("Number of Available Copies for " + isbn + ": ");
                        if(rs.next()){
                            if(rs.getString(1).equals("")) System.out.println(0);
                            else System.out.println(rs.getString(1));
                        }
                        break;
                    case 2:     //Title
                        System.out.println("Enter the Title:");
                        title = scan.nextLine();
                        sqlQuery = "Select Count(*) FROM Books b, Book_Copies bc WHERE b.ISBN = bc.ISBN AND b.Title LIKE ? AND bc.Status = 'Available'";
                        pstmt2=con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1, "%" + title + "%");
                        rs = pstmt2.executeQuery();
                        System.out.println("Number of Available Copies for book titles Containing \"" + title + "\": ");
                        if(rs.next()){
                            if(rs.getString(1).equals("")) System.out.print(0);
                            else System.out.print(rs.getString(1));
                        }
                        System.out.println();

                        break;
                }
                userChoice = -1;
                break;
            case 3:   //add a new copy for an existing book
                System.out.println("3. Add a New Copy for an Existing Book:\n");
                System.out.println("Add new copy through:(1: ISBN or 2: Title)");
                tempchoice = scan.nextInt();
                scan.nextLine();  
                isbn = "";
                title ="";
                switch(tempchoice){
                    case 1:                //ISBN
                        System.out.println("Enter the ISBN:");
                        isbn = scan.nextLine();
                        sqlQuery = "SELECT MAX(Copy#) FROM Book_Copies WHERE ISBN = ?";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1,isbn);
                        rs = pstmt2.executeQuery();
                        nextID = 1;
                        if(rs.next()) { 
                            nextID += rs.getInt(1);
                        }
                        sqlQuery = "INSERT INTO Book_Copies VALUES(?, ?,?)";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1,isbn);
                        pstmt2.setInt(2,nextID);
                        System.out.println("Enter the status: (e.g, 'Available', 'Checked out', 'Damaged')");
                        pstmt2.setString(3,scan.nextLine());
                        success = pstmt2.executeUpdate();
                        if(success == 1){
                            System.out.println("Item has been inserted. Copy Number = " + nextID);
                        }
                        else System.out.println("Item was not inserted.");
                        break;
                    case 2:                //Title
                        System.out.println("Enter the title:");
                        title = scan.nextLine();
                        sqlQuery = "SELECT ISBN FROM Books WHERE Title = ?";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1,title);
                        rs = pstmt2.executeQuery();
                        isbn = "";
                        if(rs.next()) { 
                            if(rs.getString(1) != ""){
                                isbn = rs.getString(1);
                            }
                            else {
                                System.out.println("Could not find isbn");
                                break;
                            }
                        }
                        sqlQuery = "SELECT MAX(Copy#) FROM Book_Copies WHERE ISBN = ?";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1,isbn);
                        rs = pstmt2.executeQuery();
                        nextID = 1;
                        if(rs.next()) { 
                            nextID += rs.getInt(1);
                        }
                        sqlQuery = "INSERT INTO Book_Copies VALUES(?, ?,?)";
                        pstmt2 = con.prepareStatement(sqlQuery);
                        pstmt2.clearParameters();
                        pstmt2.setString(1,isbn);
                        pstmt2.setInt(2,nextID);
                        System.out.println("Enter the status: (e.g, 'Available', 'Checked out', 'Damaged')");
                        pstmt2.setString(3,scan.nextLine());
                        success = pstmt2.executeUpdate();
                        if(success == 1){
                            System.out.println("Item has been inserted. Copy Number = " + nextID);
                        }
                        else System.out.println("Item was not inserted.");
                        break;
                }
                userChoice = -1;
                break; 
            case 4:   //update book copy status
                System.out.println("Enter book copy ISBN:");
                isbn = scan.nextLine();
                System.out.println("Enter book copy number:");
                copynum = scan.nextInt();
                scan.nextLine();
                System.out.println();
                System.out.println("Enter book copy new status: (e.g, 'Available', 'Checked out', 'Damaged')");
                status = scan.nextLine();
                if(!status.equals("Available") && !status.equals("Checked out") && !status.equals("Damaged")) {
                    System.out.println("Not a valid status.\n");
                    userChoice = -1;
                    break;
                }
                
                sqlQuery = "SELECT status FROM Book_Copies WHERE ISBN = ? AND Copy# = ?";
                pstmt2 = con.prepareStatement(sqlQuery);
                pstmt2.clearParameters();
                pstmt2.setString(1,isbn);
                pstmt2.setInt(2, copynum);
                rs = pstmt2.executeQuery();
                if(rs.next()){
                    if(rs.getString(1).equals("Damaged")){
                        System.out.println("\nInvalid update due to status being damaged.\n");
                        userChoice = -1;
                        break;
                    }
                }
                sqlQuery = "UPDATE Book_copies SET Status = ? WHERE ISBN = ? AND Copy# = ?";
                pstmt2 = con.prepareStatement(sqlQuery);
                pstmt2.clearParameters();
                pstmt2.setString(1,status);
                pstmt2.setString(2,isbn);
                pstmt2.setInt(3,copynum);
                pstmt2.executeUpdate();
                System.out.println("Book copy status was updated.");
                userChoice = -1;
                break;
            default:
                System.out.println("Exiting the program.");
        }
    }
    if(pstmt2 != null) pstmt2.close();
    if(stmt != null) stmt.close();
    if(scan != null) scan.close();
    if(rs != null) rs.close();
    if(con != null) con.close(); //close connection 
    } catch( Exception e) {e.printStackTrace();}
    }

    public static void connectToDatabase()
    {
	String driverPrefixURL="jdbc:oracle:thin:@";
	String jdbc_url="artemis.vsnet.gmu.edu:1521/vse18c.vsnet.gmu.edu";
	
        // IMPORTANT: DO NOT PUT YOUR LOGIN INFORMATION HERE. INSTEAD, PROMPT USER FOR HIS/HER LOGIN/PASSWD
            System.out.println("Enter your Username:");
            String username = scan.nextLine();
            System.out.println("Enter your Password:");
            String password = scan.nextLine(); 
        try{
	    //Register Oracle driver
            DriverManager.registerDriver(new oracle.jdbc.driver.OracleDriver());
        } catch (Exception e) {
            System.out.println("Failed to load JDBC/ODBC driver.");
            return;
        }

       try{
            System.out.println(driverPrefixURL+jdbc_url);
            con=DriverManager.getConnection(driverPrefixURL+jdbc_url, username, password);
            DatabaseMetaData dbmd=con.getMetaData();
            stmt=con.createStatement();

            System.out.println("Connected.");

            if(dbmd==null){
                System.out.println("No database meta data");
            }
            else {
                System.out.println("Database Product Name: "+dbmd.getDatabaseProductName());
                System.out.println("Database Product Version: "+dbmd.getDatabaseProductVersion());
                System.out.println("Database Driver Name: "+dbmd.getDriverName());
                System.out.println("Database Driver Version: "+dbmd.getDriverVersion());
            }
        }catch( Exception e) {e.printStackTrace();}

    }// End of connectToDatabase()
}// End of class

