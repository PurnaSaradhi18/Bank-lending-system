#include <iostream>
#include <string>
using namespace std;

string caesarCipher(string msg, int shift, bool encode){
  if(!encode){
    shift = 26-(shift % 26);
  }
  string res = "";

  for(int i=0; i<msg.length(); i++){
    char ch = msg[i];
    if(ch >= 'A' && ch <= 'Z'){
      ch = 'A' + (ch - 'A' + shift) % 26;
    }
    else if(ch >= 'a' && ch <= 'z'){
      ch = 'a' + (ch - 'a' + shift) % 26;
    }
    res += ch;
  }
  return res;
}

int main(){
  string msg;
  int shift;
  cout << "Enter the message: ";
  getline(cin, msg);
  cout << "Enter shift: ";
  cin >> shift;

  string encoded = caesarCipher(msg, shift, true);
  cout << "Encoded: " << encoded << endl;
  string decoded = caesarCipher(encoded, shift, false);
  cout << "Decoded: " << decoded << endl;
  return 0;
}