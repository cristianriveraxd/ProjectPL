import cv2
import numpy as np

cap = cv2.VideoCapture('01.mp4')

# Lee el primer frame como referencia
ret, frame1 = cap.read()
frame1_gray = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
frame1_gray = cv2.GaussianBlur(frame1_gray, (21, 21), 0)

while True:
    # Lee un nuevo frame
    ret, frame2 = cap.read()
    frame2_gray = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
    frame2_gray = cv2.GaussianBlur(frame2_gray, (21, 21), 0)

    # Calcula la diferencia
    frame_delta = cv2.absdiff(frame1_gray, frame2_gray)
    thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]

    # Detección de contornos
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    movement_detected = False
    for contour in contours:
        if cv2.contourArea(contour) > 500:  
            movement_detected = True
            break

    if movement_detected:
        print("🔄 Movimiento detectado")
    else:
        print("⏸️ Rodillos detenidos")

    
    cv2.imshow("Frame", frame2)
    #cv2.imshow("Delta", frame_delta)
    #cv2.imshow("Threshold", thresh)

    frame1_gray = frame2_gray

    # Salir con 'q'
    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()